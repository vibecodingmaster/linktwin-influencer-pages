"""
Linktw Bulk Link Manager

Reads a CSV of short links exported from Linktw and:
  - Creates new links that don't exist yet via the Linktw API
  - Updates existing links with geo-targeting for 71 countries
  - Skips geo-targeting for links marked "NO" in the GEO TARGETED column

Usage:
    pip install requests
    python bulk_update_links.py
"""

import csv
import datetime
import getpass
import glob
import json
import os
import sys
import time
from urllib.parse import urlparse

import requests

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

API_BASE = "https://linktw.in/api"

MAX_RETRIES = 3
RETRY_BASE_DELAY = 2        # seconds — doubles each retry (2, 4, 8)
RATE_LIMIT_DELAY = 2.0      # seconds between API calls
REQUEST_TIMEOUT = 60         # seconds per HTTP request
GEO_REQUEST_TIMEOUT = 120    # seconds for requests with geo payloads

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "OUTPUT")

# 71 countries supported by Linktw geo-targeting
COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Argentina", "Australia",
    "Austria", "Belgium", "Brazil", "Bulgaria", "Cambodia",
    "Canada", "China", "Colombia", "Costa Rica", "Croatia",
    "Czechia", "Denmark", "Ecuador", "Egypt", "Estonia",
    "Ethiopia", "Finland", "France", "Germany", "Ghana",
    "Greece", "Hong Kong", "Hungary", "Indonesia", "Iran",
    "Iraq", "Ireland", "Israel", "Italy", "Japan",
    "Jordan", "Kenya", "Latvia", "Lebanon", "Lithuania",
    "Malaysia", "Morocco", "Myanmar", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Nigeria", "Norway", "Pakistan",
    "Panama", "Peru", "Poland", "Portugal", "Romania",
    "Russia", "Saudi Arabia", "Serbia", "Singapore", "South Africa",
    "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
    "Thailand", "Turkey", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States",
]

# ---------------------------------------------------------------------------
# Logger — writes to console AND output file simultaneously
# ---------------------------------------------------------------------------


class Logger:
    """Dual output: prints to console and writes to a log file."""

    def __init__(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        self.file = open(filepath, "w", encoding="utf-8")
        self.filepath = filepath

    def log(self, message=""):
        print(message)
        self.file.write(message + "\n")
        self.file.flush()

    def close(self):
        self.file.close()


# ---------------------------------------------------------------------------
# Functions
# ---------------------------------------------------------------------------


def select_csv():
    """List CSV files in the script directory and let user pick one."""
    csv_files = sorted(glob.glob(os.path.join(SCRIPT_DIR, "*.csv")))

    if not csv_files:
        print("ERROR: No CSV files found in:")
        print(f"  {SCRIPT_DIR}")
        sys.exit(1)

    print("Available CSV files:")
    print()
    for i, path in enumerate(csv_files, start=1):
        name = os.path.basename(path)
        size = os.path.getsize(path)
        print(f"  {i}. {name}  ({size:,} bytes)")
    print()

    while True:
        choice = input(f"Select a CSV file (1-{len(csv_files)}): ").strip()
        if choice.isdigit() and 1 <= int(choice) <= len(csv_files):
            selected = csv_files[int(choice) - 1]
            print(f"Selected: {os.path.basename(selected)}")
            return selected
        print(f"Invalid choice. Enter a number between 1 and {len(csv_files)}.")


def get_api_key():
    """Prompt user for API key or read from environment variable."""
    key = os.environ.get("LINKTW_API_KEY", "").strip()
    if key:
        masked = key[:4] + "..." + key[-4:] if len(key) > 8 else "****"
        print(f"Using API key from LINKTW_API_KEY env var: {masked}")
        return key

    key = getpass.getpass("Enter your Linktw API key: ").strip()
    if not key:
        print("ERROR: API key cannot be empty.")
        sys.exit(1)
    return key


def load_csv(filepath):
    """Read the CSV file and return a list of row dicts."""
    if not os.path.isfile(filepath):
        print(f"ERROR: CSV file not found: {filepath}")
        sys.exit(1)

    rows = []
    with open(filepath, newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        required = {"alias", "longurl", "GEO TARGETED"}
        if not required.issubset(set(reader.fieldnames or [])):
            missing = required - set(reader.fieldnames or [])
            print(f"ERROR: CSV is missing required columns: {missing}")
            sys.exit(1)

        for row in reader:
            rows.append(row)

    return rows


def extract_domain(rows):
    """Extract the custom domain from the first valid shorturl in the CSV.

    Parses e.g. 'https://go.gramflow.link/CelesteMarlowe' and returns
    'https://go.gramflow.link'.  Returns None if no shorturl is found.
    """
    for row in rows:
        shorturl = row.get("shorturl", "").strip()
        if shorturl:
            parsed = urlparse(shorturl)
            if parsed.scheme and parsed.netloc:
                return f"{parsed.scheme}://{parsed.netloc}"
    return None


def fetch_all_links(api_key, session):
    """
    Fetch all links from the Linktw API.

    Paginates through all results and returns a list of link objects.
    Each link has 'id', 'alias', 'shorturl', 'longurl', etc.
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    all_links = []
    page = 1
    per_page = 100

    while True:
        url = f"{API_BASE}/urls?limit={per_page}&page={page}"
        resp = session.get(url, headers=headers, timeout=REQUEST_TIMEOUT)

        if resp.status_code != 200:
            print(f"ERROR: Failed to fetch links from API (HTTP {resp.status_code})")
            print(f"  Response: {resp.text[:300]}")
            sys.exit(1)

        data = resp.json()

        # Handle API response structure: { "error": "0", "data": { "urls": [...] } }
        if "data" in data and "urls" in data["data"]:
            urls = data["data"]["urls"]
        elif "urls" in data:
            urls = data["urls"]
        else:
            print(f"ERROR: Unexpected API response format:")
            print(f"  {json.dumps(data, indent=2)[:500]}")
            sys.exit(1)

        if not urls:
            break

        all_links.extend(urls)

        # If we got fewer than per_page, we've reached the last page
        if len(urls) < per_page:
            break

        page += 1

    return all_links


def build_alias_to_id_map(api_links):
    """Build a mapping of alias -> numeric ID from API link objects."""
    mapping = {}
    for link in api_links:
        alias = link.get("alias", "")
        link_id = link.get("id")
        if alias and link_id is not None:
            mapping[alias] = link_id
    return mapping


def validate_row(row):
    """Return True if the row has minimum required non-empty fields."""
    for field in ("alias", "longurl"):
        if not row.get(field, "").strip():
            return False
    return True


def should_geo_target(row):
    """Return True if geo-targeting should be applied to this link."""
    geo = row.get("GEO TARGETED", "").strip()
    return geo != "" and geo.upper() != "NO"


def build_create_payload(row, custom_domain):
    """Build the full POST payload for creating a new link.

    Includes domain, geo-targeting (if applicable), collections, and metadata
    so that everything is set in a single API call.
    """
    alias = row["alias"].strip()
    long_url = row["longurl"].strip()

    payload = {
        "url": long_url,
        "custom": alias,
    }

    if custom_domain:
        payload["domain"] = custom_domain

    if should_geo_target(row):
        geo_link = row["GEO TARGETED"].strip()
        payload["geotarget"] = [
            {"location": country, "link": geo_link} for country in COUNTRIES
        ]

    # Optional metadata fields
    for csv_col, api_key in (
        ("collections", "collections"),
        ("display_title", "display_title"),
        ("metadescription", "metadescription"),
    ):
        value = row.get(csv_col, "").strip()
        if value:
            payload[api_key] = value

    return payload


def build_update_payload(row):
    """Build the PUT payload for updating an existing link.

    Includes url, geo-targeting (if applicable), collections, and metadata.
    Does NOT include domain (cannot be changed via the update endpoint).
    """
    long_url = row["longurl"].strip()

    payload = {
        "url": long_url,
    }

    if should_geo_target(row):
        geo_link = row["GEO TARGETED"].strip()
        payload["geotarget"] = [
            {"location": country, "link": geo_link} for country in COUNTRIES
        ]

    # Optional metadata fields
    for csv_col, api_key in (
        ("collections", "collections"),
        ("display_title", "display_title"),
        ("metadescription", "metadescription"),
    ):
        value = row.get(csv_col, "").strip()
        if value:
            payload[api_key] = value

    return payload


def create_link(payload, api_key, session, log):
    """
    POST a new short link to the Linktw API.

    Endpoint: POST /api/url/add
    Accepts a pre-built payload dict (url, custom, domain, geotarget, etc.).
    Returns (success: bool, link_id: int|None, message: str).
    """
    url = f"{API_BASE}/url/add"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    timeout = GEO_REQUEST_TIMEOUT if "geotarget" in payload else REQUEST_TIMEOUT

    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = session.post(
                url, json=payload, headers=headers, timeout=timeout
            )

            try:
                resp_body = resp.json()
            except Exception:
                resp_body = resp.text[:300]

            if resp.status_code < 300:
                new_id = None
                if isinstance(resp_body, dict):
                    new_id = resp_body.get("id")
                    if new_id is None and "data" in resp_body:
                        new_id = resp_body["data"].get("id")
                return True, new_id, f"CREATED — {json.dumps(resp_body)[:150]}"

            # 4xx — client error, no point retrying
            if 400 <= resp.status_code < 500:
                return (
                    False,
                    None,
                    f"{resp.status_code}: {json.dumps(resp_body)[:200]}",
                )

            # 5xx — server error, worth retrying
            last_error = f"{resp.status_code} {json.dumps(resp_body)[:120]}"

        except requests.ConnectionError as e:
            last_error = f"ConnectionError: {e}"
        except requests.Timeout:
            last_error = "Timeout"
        except requests.RequestException as e:
            last_error = f"RequestException: {e}"

        if attempt < MAX_RETRIES:
            delay = RETRY_BASE_DELAY * (2 ** (attempt - 1))
            log.log(f"  RETRY {attempt}/{MAX_RETRIES} ({last_error}) — waiting {delay}s")
            time.sleep(delay)

    return False, None, f"All {MAX_RETRIES} retries failed. Last: {last_error}"


def update_link(link_id, alias, payload, api_key, session, log):
    """
    PUT the payload to the Linktw API using the link's numeric ID.

    Endpoint: PUT /api/url/{id}/update
    Retries on 5xx / connection errors with exponential backoff.
    Returns (success: bool, status_code: int|None, message: str).
    """
    url = f"{API_BASE}/url/{link_id}/update"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    timeout = GEO_REQUEST_TIMEOUT if "geotarget" in payload else REQUEST_TIMEOUT

    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = session.put(url, json=payload, headers=headers, timeout=timeout)

            # Log the response body for debugging
            try:
                resp_body = resp.json()
            except Exception:
                resp_body = resp.text[:300]

            if resp.status_code < 300:
                return True, resp.status_code, f"OK — {json.dumps(resp_body)[:150]}"

            # 4xx — client error, no point retrying
            if 400 <= resp.status_code < 500:
                return False, resp.status_code, f"{json.dumps(resp_body)[:200]}"

            # 5xx — server error, worth retrying
            last_error = f"{resp.status_code} {json.dumps(resp_body)[:120]}"

        except requests.ConnectionError as e:
            last_error = f"ConnectionError: {e}"
        except requests.Timeout:
            last_error = "Timeout"
        except requests.RequestException as e:
            last_error = f"RequestException: {e}"

        if attempt < MAX_RETRIES:
            delay = RETRY_BASE_DELAY * (2 ** (attempt - 1))
            log.log(f"  RETRY {attempt}/{MAX_RETRIES} ({last_error}) — waiting {delay}s")
            time.sleep(delay)

    return False, None, f"All {MAX_RETRIES} retries failed. Last: {last_error}"


def main():
    print("=" * 55)
    print("  Linktw Bulk Link Manager")
    print("=" * 55)
    print()

    # --- Select CSV ---
    csv_path = select_csv()
    csv_name = os.path.basename(csv_path)
    rows = load_csv(csv_path)
    print(f"CSV loaded: {len(rows)} links")

    # --- Extract custom domain from CSV shorturls ---
    custom_domain = extract_domain(rows)
    if custom_domain:
        print(f"Custom Domain: {custom_domain}")
    else:
        print("WARNING: No custom domain found in CSV shorturls — API will use default")
    print()

    # --- API key ---
    api_key = get_api_key()
    masked_key = api_key[:4] + "..." + api_key[-4:] if len(api_key) > 8 else "****"
    print(f"API Key: {masked_key}")
    print()

    # --- Fetch existing links from API to get numeric IDs ---
    print("Fetching links from Linktw API to resolve numeric IDs...")
    session = requests.Session()
    api_links = fetch_all_links(api_key, session)
    print(f"Found {len(api_links)} links in your Linktw account")

    alias_to_id = build_alias_to_id_map(api_links)
    print()

    # --- Categorize links ---
    new_aliases = []
    existing_aliases = []
    for row in rows:
        alias = row.get("alias", "").strip()
        if alias and alias not in alias_to_id:
            new_aliases.append(alias)
        elif alias:
            existing_aliases.append(alias)

    print(f"Existing links to process: {len(existing_aliases)}")
    print(f"New links to create:       {len(new_aliases)}")
    if new_aliases:
        for a in new_aliases:
            geo = None
            for r in rows:
                if r.get("alias", "").strip() == a:
                    geo = r.get("GEO TARGETED", "").strip()
                    break
            geo_label = "NO geo" if (not geo or geo.upper() == "NO") else "with geo"
            print(f"  + {a}  ({geo_label})")
    print()

    # --- Dry run? ---
    dry_run_input = input("Dry run? (y/N): ").strip().lower()
    dry_run = dry_run_input in ("y", "yes")
    print()

    # --- Create output log file ---
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    mode_tag = "DRYRUN" if dry_run else "LIVE"
    csv_stem = os.path.splitext(csv_name)[0]
    output_filename = f"{csv_stem}_{mode_tag}_{timestamp}.txt"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    log = Logger(output_path)

    # --- Log header ---
    log.log("=" * 55)
    log.log("  Linktw Bulk Link Manager — Run Log")
    log.log("=" * 55)
    log.log(f"Date/Time     : {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log.log(f"CSV File      : {csv_name}")
    log.log(f"Total Links   : {len(rows)}")
    log.log(f"  Existing    : {len(existing_aliases)}")
    log.log(f"  New         : {len(new_aliases)}")
    log.log(f"API Key       : {masked_key}")
    log.log(f"Mode          : {'DRY-RUN' if dry_run else 'LIVE'}")
    log.log(f"Custom Domain : {custom_domain or '(none — API default)'}")
    log.log(f"Countries     : {len(COUNTRIES)}")
    log.log(f"API Links     : {len(api_links)} found in account")
    log.log(f"Create EP     : POST {API_BASE}/url/add")
    log.log(f"Update EP     : PUT {API_BASE}/url/{{id}}/update")
    log.log(f"Max Retries   : {MAX_RETRIES}")
    log.log(f"Rate Limit    : {RATE_LIMIT_DELAY}s between calls")
    log.log(f"Output File   : {output_filename}")
    log.log("-" * 55)

    if dry_run:
        log.log("** DRY-RUN MODE — no API calls will be made **")
        log.log("-" * 55)

    # --- Log all link details before processing ---
    log.log("")
    log.log("LINK DETAILS:")
    log.log("")
    for i, row in enumerate(rows, start=1):
        alias = row.get("alias", "").strip()
        longurl = row.get("longurl", "").strip()
        geo_raw = row.get("GEO TARGETED", "").strip()
        shorturl = row.get("shorturl", "").strip()
        valid = validate_row(row)
        link_id = alias_to_id.get(alias)
        is_new = link_id is None
        geo_on = should_geo_target(row)

        id_str = str(link_id) if link_id is not None else "NEW"
        geo_str = geo_raw if geo_on else f"NO (skip geo-targeting)"

        if is_new:
            action = "CREATE" + (" + GEO" if geo_on else "")
        elif geo_on:
            action = "UPDATE + GEO"
        else:
            action = "SKIP (existing, no geo)"

        log.log(f"  [{i}] alias     : {alias}")
        log.log(f"      action    : {action}")
        log.log(f"      API id    : {id_str}")
        log.log(f"      shorturl  : {shorturl}")
        log.log(f"      longurl   : {longurl}")
        log.log(f"      geo target: {geo_str}")
        log.log(f"      valid     : {'YES' if valid else 'NO — will be skipped'}")
        log.log("")

    log.log("-" * 55)
    log.log("")

    # --- Process each row ---
    ok_count = 0
    fail_count = 0
    skip_count = 0
    create_count = 0
    geo_count = 0
    failed_aliases = []
    first_geo_logged = False
    start_time = time.time()

    try:
        for i, row in enumerate(rows, start=1):
            alias = row.get("alias", "").strip()
            label = alias or "(unknown)"

            # Validate
            if not validate_row(row):
                skip_count += 1
                log.log(f"[{i}/{len(rows)}] {label} ... SKIPPED (missing fields)")
                continue

            link_id = alias_to_id.get(alias)
            is_new = link_id is None
            geo_on = should_geo_target(row)

            # =============================================================
            # DRY RUN
            # =============================================================
            if dry_run:
                if is_new:
                    payload = build_create_payload(row, custom_domain)
                    geo_label = (
                        f" + geo ({len(COUNTRIES)} countries)"
                        if geo_on
                        else " (no geo)"
                    )
                    log.log(
                        f"[{i}/{len(rows)}] {label} (NEW) ... DRY-RUN CREATE"
                        f"{geo_label}"
                        f"  domain={custom_domain or 'default'}"
                        f"  url={row['longurl'].strip()}"
                    )
                    create_count += 1
                    if geo_on:
                        geo_count += 1
                elif geo_on:
                    payload = build_update_payload(row)
                    geo_link = row["GEO TARGETED"].strip()
                    log.log(
                        f"[{i}/{len(rows)}] {label} (id={link_id}) ... DRY-RUN "
                        f"UPDATE + geo ({len(COUNTRIES)} countries, "
                        f"geo_link={geo_link})"
                    )
                    geo_count += 1
                else:
                    # Existing link, no geo needed — skip
                    skip_count += 1
                    log.log(
                        f"[{i}/{len(rows)}] {label} (id={link_id}) ... "
                        f"SKIPPED (existing, no geo-targeting needed)"
                    )
                    continue

                # Log sample payload for first geo-targeted link
                if not first_geo_logged and geo_on:
                    first_geo_logged = True
                    log.log("")
                    if is_new:
                        log.log(f"  Endpoint: POST {API_BASE}/url/add")
                        log.log(f"  Timeout : {GEO_REQUEST_TIMEOUT}s (geo payload)")
                    else:
                        log.log(f"  Endpoint: PUT {API_BASE}/url/{link_id}/update")
                        log.log(f"  Timeout : {GEO_REQUEST_TIMEOUT}s (geo payload)")
                    log.log("  Sample payload (first 3 countries):")
                    sample = dict(payload)
                    if "geotarget" in sample:
                        sample["geotarget"] = (
                            sample["geotarget"][:3]
                            + [{"...": f"({len(COUNTRIES)} total)"}]
                        )
                    for line in json.dumps(sample, indent=4).splitlines():
                        log.log(f"    {line}")
                    log.log("")

                ok_count += 1
                continue

            # =============================================================
            # LIVE MODE
            # =============================================================

            # Rate limiting
            if i > 1:
                time.sleep(RATE_LIMIT_DELAY)

            # ----- NEW LINK: single-call create with domain + geo -----
            if is_new:
                payload = build_create_payload(row, custom_domain)
                success, new_id, msg = create_link(
                    payload, api_key, session, log
                )

                if not success:
                    fail_count += 1
                    log.log(
                        f"[{i}/{len(rows)}] {label} (NEW) ... "
                        f"FAILED CREATE ({msg})"
                    )
                    failed_aliases.append((alias, f"CREATE: {msg}"))
                    continue

                create_count += 1
                if geo_on:
                    geo_count += 1
                ok_count += 1
                log.log(f"[{i}/{len(rows)}] {label} (NEW -> id={new_id}) ... {msg}")
                continue

            # ----- EXISTING LINK with NO geo — skip -----
            if not geo_on:
                skip_count += 1
                log.log(
                    f"[{i}/{len(rows)}] {label} (id={link_id}) ... "
                    f"SKIPPED (no geo-targeting)"
                )
                continue

            # ----- EXISTING LINK: update with geo-targeting -----
            payload = build_update_payload(row)
            success, status, msg = update_link(
                link_id, alias, payload, api_key, session, log
            )

            if success:
                ok_count += 1
                geo_count += 1
                log.log(
                    f"[{i}/{len(rows)}] {label} (id={link_id}) ... {msg}"
                )
            else:
                fail_count += 1
                status_str = str(status) if status else "N/A"
                log.log(
                    f"[{i}/{len(rows)}] {label} (id={link_id}) "
                    f"... FAILED GEO-UPDATE ({status_str}: {msg})"
                )
                failed_aliases.append((alias, f"GEO-UPDATE {status_str}: {msg}"))

    except KeyboardInterrupt:
        log.log("\n** Interrupted by user **")

    elapsed = time.time() - start_time
    log.log("")
    log.log("-" * 55)
    mode_label = " (DRY-RUN)" if dry_run else ""
    log.log(
        f"Summary{mode_label}: {ok_count} OK | {create_count} CREATED | "
        f"{geo_count} GEO-TAGGED | {fail_count} FAILED | "
        f"{skip_count} SKIPPED | {elapsed:.1f}s"
    )

    if failed_aliases:
        log.log("")
        log.log("Failed links:")
        for alias, reason in failed_aliases:
            log.log(f"  {alias} — {reason}")

    # =================================================================
    # VERIFICATION PASS (live mode only)
    # =================================================================
    if not dry_run:
        log.log("")
        log.log("=" * 55)
        log.log("  VERIFICATION PASS")
        log.log("=" * 55)
        log.log("Re-fetching all links from API to verify results...")
        log.log("")

        try:
            time.sleep(RATE_LIMIT_DELAY)
            verify_links = fetch_all_links(api_key, session)
            verify_map = {}
            for link in verify_links:
                a = link.get("alias", "")
                if a:
                    verify_map[a] = link

            log.log(f"API now has {len(verify_links)} links total")
            log.log("")

            verified_ok = 0
            verified_fail = 0

            for row in rows:
                alias = row.get("alias", "").strip()
                if not alias or not validate_row(row):
                    continue

                longurl = row.get("longurl", "").strip()
                geo_on = should_geo_target(row)
                api_link = verify_map.get(alias)

                if api_link is None:
                    verified_fail += 1
                    log.log(f"  VERIFY FAIL : {alias} — NOT FOUND in API")
                else:
                    api_longurl = api_link.get("longurl", "").strip()
                    api_id = api_link.get("id", "?")
                    url_match = api_longurl == longurl

                    if url_match:
                        geo_status = ""
                        if geo_on:
                            geo_data = api_link.get("geotarget") or api_link.get("geo")
                            if geo_data:
                                geo_status = f" | geo: {len(geo_data)} entries"
                            else:
                                geo_status = " | geo: present (not in list response)"
                        else:
                            geo_status = " | geo: N/A (not required)"

                        # Check domain on shorturl
                        domain_status = ""
                        api_shorturl = api_link.get("shorturl", "")
                        if custom_domain and api_shorturl:
                            if api_shorturl.startswith(custom_domain):
                                domain_status = f" | domain: OK"
                            else:
                                domain_status = (
                                    f" | domain: WRONG ({api_shorturl})"
                                )

                        verified_ok += 1
                        log.log(
                            f"  VERIFY OK   : {alias} (id={api_id}) "
                            f"— URL matches{geo_status}{domain_status}"
                        )
                    else:
                        verified_fail += 1
                        log.log(
                            f"  VERIFY FAIL : {alias} (id={api_id}) "
                            f"— URL mismatch! CSV={longurl} API={api_longurl}"
                        )

            log.log("")
            log.log(
                f"Verification: {verified_ok} CONFIRMED "
                f"| {verified_fail} PROBLEMS"
            )

            # Cross-reference reported failures with actual API state
            if failed_aliases:
                log.log("")
                log.log("Cross-check reported failures:")
                for fa_alias, reason in failed_aliases:
                    api_link = verify_map.get(fa_alias)
                    if api_link:
                        api_id = api_link.get("id", "?")
                        log.log(
                            f"  {fa_alias} — reported FAILED but EXISTS "
                            f"in API (id={api_id}) — timeout after success"
                        )
                    else:
                        log.log(
                            f"  {fa_alias} — CONFIRMED FAILED "
                            f"— not found in API"
                        )

        except Exception as e:
            log.log(f"  Verification error: {e}")
            log.log("  (Does not affect operations already performed)")

    log.log("")
    log.log(f"Log saved to: {output_path}")
    log.close()

    print()
    print(f"Output saved to: {output_path}")
    print()


if __name__ == "__main__":
    main()
