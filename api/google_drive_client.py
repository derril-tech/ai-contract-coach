import os
import io
import json
import logging
import requests
from typing import Dict, Any, Optional

from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

logger = logging.getLogger("google_drive_client")
logger.setLevel(logging.INFO)

SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid'
]

def get_auth_url(redirect_uri: str) -> str:
    """
    Generates the Google OAuth 2.0 authorization URL.
    """
    try:
        client_config = {
            "web": {
                "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        }
        
        flow = Flow.from_client_config(
            client_config,
            scopes=SCOPES,
            redirect_uri=redirect_uri
        )
        
        auth_url, _ = flow.authorization_url(prompt='consent')
        return auth_url
    except Exception as e:
        logger.error(f"Failed to generate auth URL: {e}")
        raise e

def exchange_code_for_tokens(code: str, redirect_uri: str) -> Dict[str, Any]:
    """
    Exchanges the authorization code for access/refresh tokens.
    """
    try:
        client_config = {
            "web": {
                "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        }
        
        flow = Flow.from_client_config(
            client_config,
            scopes=SCOPES,
            redirect_uri=redirect_uri
        )
        
        flow.fetch_token(code=code)
        creds = flow.credentials
        
        return {
            "access_token": creds.token,
            "refresh_token": creds.refresh_token,
            "token_uri": creds.token_uri,
            "client_id": creds.client_id,
            "client_secret": creds.client_secret,
            "scopes": creds.scopes
        }
    except Exception as e:
        logger.error(f"Token exchange failed: {e}")
        raise e

def fetch_file_metadata(file_id: str, access_token: str) -> Dict[str, Any]:
    """
    Fetches metadata for a Google Drive file.
    """
    try:
        creds = Credentials(token=access_token)
        service = build('drive', 'v3', credentials=creds)
        
        file_metadata = service.files().get(
            fileId=file_id, 
            fields="id, name, mimeType, size, createdTime"
        ).execute()
        
        return file_metadata
    except Exception as e:
        logger.error(f"Failed to fetch file metadata: {e}")
        raise e

def download_file_content(file_id: str, access_token: str) -> bytes:
    """
    Downloads the content of a Google Drive file.
    Handles Google Docs export to PDF/Text if needed, or raw download for PDFs.
    """
    try:
        creds = Credentials(token=access_token)
        service = build('drive', 'v3', credentials=creds)
        
        # Check mime type first to decide download strategy
        metadata = service.files().get(fileId=file_id).execute()
        mime_type = metadata.get('mimeType')
        
        request = None
        if mime_type == 'application/vnd.google-apps.document':
            # Export Google Doc as plain text
            request = service.files().export_media(fileId=file_id, mimeType='text/plain')
        elif mime_type == 'application/pdf':
            request = service.files().get_media(fileId=file_id)
        elif mime_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
             # Docx
             request = service.files().get_media(fileId=file_id)
        else:
             # Try plain text export fallback or raw
             request = service.files().get_media(fileId=file_id)

        file_content = io.BytesIO()
        downloader = MediaIoBaseDownload(file_content, request)
        
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            
        return file_content.getvalue()
    except Exception as e:
        logger.error(f"Failed to download file content: {e}")
        raise e

