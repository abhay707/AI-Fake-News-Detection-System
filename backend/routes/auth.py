from fastapi import APIRouter, HTTPException, Depends, Request
from schemas import SignupRequest, LoginRequest, UpdateUserRequest
from services.db_service import get_client
import logging
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup")
async def signup(req: SignupRequest):
    client = get_client()
    try:
        # Generate Investigator ID based on UUID short
        investigator_id = f"VERITY-{str(uuid.uuid4())[:4].upper()}-X"

        res = client.auth.sign_up({
            "email": req.email,
            "password": req.password,
            "options": {
                "data": {
                    "full_name": req.name,
                    "investigator_id": investigator_id,
                    "image": ""
                }
            }
        })
        return {"status": "success", "user": res.user, "session": res.session}
    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(req: LoginRequest):
    client = get_client()
    try:
        res = client.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        return {"status": "success", "user": res.user, "session": res.session}
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))

@router.put("/update")
async def update_user(req: UpdateUserRequest, request: Request):
    client = get_client()
    
    # We must authorize the supabase client with the user's access token
    auth_header = request.headers.get("Authorization")
    if not auth_header:
         raise HTTPException(status_code=401, detail="Missing Authorization Header")
    
    token = auth_header.replace("Bearer ", "")
    
    try:
        # set session for client
        client.auth.set_session(token, "") 
        # Alternatively we can use update_user on the client if it uses the session
        res = client.auth.update_user({
            "data": {
                "full_name": req.name,
                "investigator_id": req.id,
                "image": req.image
            }
        })
        # Important: clear session so it doesn't leak into other requests
        client.auth.sign_out()
        return {"status": "success", "user": res.user}
    except Exception as e:
        logger.error(f"Update error: {str(e)}")
        # If set_session / sign_out fails
        try:
            client.auth.sign_out()
        except:
             pass
        raise HTTPException(status_code=400, detail=str(e))
