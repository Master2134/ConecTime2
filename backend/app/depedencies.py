from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.usuario_model import UsuarioModel
from app.utils.security import SECRET_KEY, ALGORITHM

# Define que a rota de login é /auth/login (para o Swagger entender)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def obter_usuario_atual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(UsuarioModel).filter(UsuarioModel.email == email).first()
    if user is None:
        raise credentials_exception
    return user