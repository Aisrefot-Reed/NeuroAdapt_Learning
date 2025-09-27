from pydantic import BaseModel

class ContentAdaptationRequest(BaseModel):
    text: str
