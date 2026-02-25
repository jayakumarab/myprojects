from pydantic import BaseModel, EmailStr
from datetime import datetime
from models import RoleEnum
from typing import Optional, List

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[RoleEnum] = None
    user_id: Optional[int] = None

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: RoleEnum = RoleEnum.user

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[RoleEnum] = None
    password: Optional[str] = None

# Activity Log Schemas
class ActivityLogBase(BaseModel):
    action: str

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase):
    id: int
    user_id: int
    timestamp: datetime

    class Config:
        from_attributes = True
