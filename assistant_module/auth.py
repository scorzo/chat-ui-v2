import os
import jwt
from quart import request
import assistant_module.config as config

# JWT secret key (keep this safe, and in production, it should be in environment variables)
JWT_SECRET = os.environ.get('JWT_SECRET', 'your_secret_key')
JWT_ALGORITHM = 'HS256'  # Algorithm used to sign the JWT

def get_jwt_payload():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        config.user = payload  # Store in config for later use in the request lifecycle
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
