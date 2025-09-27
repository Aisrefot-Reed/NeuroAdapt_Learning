from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    neuroprofile_id: int

class User(BaseModel):
    id: int
    email: EmailStr

    class Config:
        orm_mode = True
