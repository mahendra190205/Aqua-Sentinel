import hashlib
import datetime
import json

def generate_hash(data: dict) -> str:
    """
    Generates a SHA-256 cryptographic hash for the given data dictionary.
    """
    # Sort keys to ensure consistent ordering for hashing
    data_string = json.dumps(data, sort_keys=True)
    return hashlib.sha256(data_string.encode('utf-8')).hexdigest()

def timestamp_log(data: dict) -> dict:
    """
    Adds a precise UTC timestamp to the data log.
    """
    data['timestamp'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return data
