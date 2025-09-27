
from fastapi import FastAPI, HTTPException, Response, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.huggingface import simplify_text, text_to_speech
from app.schemas.content import ContentAdaptationRequest
from app.schemas.user import UserCreate, UserLogin, UserProfileUpdate
from app.schemas.audio import TextToSpeechRequest
from app.schemas.progress import ProgressCreate
from app.core.supabase_client import supabase

app = FastAPI(
    title="NeuroAdapt Learning API",
    description="API for adapting educational content for students with neurodiversities.",
    version="0.1.0",
)

bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    try:
        token = credentials.credentials
        user = supabase.auth.get_user(token)
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.get("/")
def read_root():
    return {"message": "Welcome to the NeuroAdapt Learning API"}

# ... (other endpoints remain the same)

@app.post("/api/progress")
def save_progress(progress: ProgressCreate, user: dict = Depends(get_current_user)):
    try:
        user_id = user.user.id
        data = progress.dict()
        data['user_id'] = user_id
        res = supabase.table('progress').insert(data).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/me")
def get_my_analytics(user: dict = Depends(get_current_user)):
    try:
        user_id = user.user.id
        res = supabase.table('progress').select('*').eq('user_id', user_id).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/neuroprofiles")
def get_neuroprofiles():
    try:
        res = supabase.table('neuroprofiles').select('*').execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/users/profile")
def update_user_profile(profile_update: UserProfileUpdate, user: dict = Depends(get_current_user)):
    try:
        user_id = user.user.id
        res = supabase.table('user_profiles').upsert({'user_id': user_id, 'neuroprofile_id': profile_update.neuroprofile_id}).execute()
        return res.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/adapt-content")
def adapt_content(request: ContentAdaptationRequest, user: dict = Depends(get_current_user)):
    try:
        user_id = user.user.id
        # Get user's neuroprofile
        profile_res = supabase.table('user_profiles').select('neuroprofile_id').eq('user_id', user_id).single().execute()
        
        adapted_text = request.text # Default to original text
        
        if profile_res.data:
            neuroprofile_id = profile_res.data['neuroprofile_id']
            # Get profile name
            profile_name_res = supabase.table('neuroprofiles').select('name').eq('id', neuroprofile_id).single().execute()
            
            if profile_name_res.data:
                profile_name = profile_name_res.data['name']
                
                if profile_name == 'dyslexia':
                    # Apply text simplification model
                    simplified_output = simplify_text(request.text)
                    # The model returns a list with a dictionary, we extract the generated text
                    if simplified_output and isinstance(simplified_output, list) and 'generated_text' in simplified_output[0]:
                        adapted_text = simplified_output[0]['generated_text']
                # Add more conditions for other profiles here in the future
                # elif profile_name == 'adhd':
                #     ...

        return {"original_text": request.text, "adapted_text": adapted_text}

    except Exception as e:
        # If no profile is found, single() will raise an error. We can handle it gracefully.
        # For now, just return the original text if any error occurs.
        return {"original_text": request.text, "adapted_text": request.text}

@app.post("/api/text-to-speech")
def generate_speech(request: TextToSpeechRequest):
    audio_data = text_to_speech(request.text)
    return Response(content=audio_data, media_type="audio/flac")

@app.post("/api/auth/register")
def register(user: UserCreate):
    try:
        res = supabase.auth.sign_up({"email": user.email, "password": user.password})
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
def login(user: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({"email": user.email, "password": user.password})
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
