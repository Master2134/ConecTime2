from pydantic import BaseModel
from typing import Optional
from enum import Enum

class GrupoEnum(str, Enum):
    familia = "Família"
    trabalho = "Trabalho"
    amigos = "Amigos"
    outros = "Outros"

class ContatoBase(BaseModel):
    nome: str
    telefone: str
    email: Optional[str] = None
    grupo: Optional[GrupoEnum] = GrupoEnum.outros
    is_favorito: bool = False
    notas: Optional[str] = None
    historico_chamadas: Optional[str] = None

class ContatoCreate(ContatoBase):
    pass

class ContatoUpdate(ContatoBase):
    pass

class ContatoResponse(ContatoBase):
    id: int
    class Config:
        from_attributes = True