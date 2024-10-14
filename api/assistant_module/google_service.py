import pickle
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os

SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/spreadsheets']
CREDENTIALS_FILE = 'client_secret.json'

# Valid service and version combinations
VALID_SERVICES = {
    'calendar': 'v3',
    'sheets': 'v4'
}

def get_google_service(service_name, version):
    """
    Opens the stored credentials from 'token.pickle' and returns the requested Google API service.
    The service_name must be 'calendar' or 'sheets' and the version must be 'v3' or 'v4', respectively.
    Assumes that valid credentials have already been saved.
    """
    # Validate the service_name and version combination
    if service_name not in VALID_SERVICES or VALID_SERVICES[service_name] != version:
        raise ValueError(f"Invalid service_name and version combination. Must be one of: {VALID_SERVICES}")

    creds = None
    try:
        # Load credentials from the token.pickle file
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token_file:
                creds = pickle.load(token_file)
        else:
            raise Exception("No credentials found. Please authenticate first.")

        # Ensure the credentials are valid and refresh if needed
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                raise Exception("Credentials are invalid or expired. Please re-authenticate.")

        # Build and return the requested Google API service
        service = build(service_name, version, credentials=creds)
        return service

    except Exception as e:
        print(f"An error occurred while building the {service_name} service: {e}")
        return None  # or raise the exception if you prefer to propagate the error
