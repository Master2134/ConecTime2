from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.usuario_model import UsuarioModel
from app.schemas.usuario_schema import UsuarioCreate, UsuarioResponse, Token
from app.utils.security import gerar_hash_senha, verificar_senha, criar_token_acesso

router = APIRouter()

@router.post("/registro", response_model=UsuarioResponse)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    user_existente = db.query(UsuarioModel).filter(UsuarioModel.email == usuario.email).first()
    if user_existente:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    novo_user = UsuarioModel(
        nome=usuario.nome,
        email=usuario.email,
        senha_hash=gerar_hash_senha(usuario.senha)
    )
    db.add(novo_user)
    db.commit()
    db.refresh(novo_user)
    return novo_user

# Usamos OAuth2PasswordRequestForm para compatibilidade total com o Swagger
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UsuarioModel).filter(UsuarioModel.email == form_data.username).first()
    
    if not user or not verificar_senha(form_data.password, user.senha_hash):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    token = criar_token_acesso(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}