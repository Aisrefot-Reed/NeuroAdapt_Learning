from pydantic import BaseModel
from typing import Optional

class ProgressCreate(BaseModel):
    content_id: str
    status: str
    score: Optional[int] = None
