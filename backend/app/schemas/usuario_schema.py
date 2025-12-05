from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    email: EmailStr

class UsuarioCreate(UsuarioBase):
    nome: str
    senha: str

class UsuarioLogin(UsuarioBase):
    email: EmailStr
    senha: str

class UsuarioResponse(UsuarioBase):
    id: int
    nome: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str