from sqlalchemy import Column, Integer, String, Boolean, Text
from app.database.connection import Base

class ContatoModel(Base):
    __tablename__ = "contatos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), index=True)
    telefone = Column(String(20), index=True)
    email = Column(String(100), nullable=True)
    grupo = Column(String(50), default="Outros")
    is_favorito = Column(Boolean, default=False)
    notas = Column(Text, nullable=True)
    historico_chamadas = Column(Text, nullable=True)