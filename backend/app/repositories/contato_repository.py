from sqlalchemy.orm import Session
from sqlalchemy import or_
# Imports atualizados:
from app.models.contato_model import ContatoModel
from app.schemas.contato_schema import ContatoCreate, ContatoUpdate


class ContatoRepository:
    def __init__(self, db: Session):
        self.db = db

    def criar(self, contato: ContatoCreate) -> ContatoModel:
        db_contato = ContatoModel(**contato.dict())
        self.db.add(db_contato)
        self.db.commit()
        self.db.refresh(db_contato)
        return db_contato

    def listar(self, search: str = None, skip: int = 0, limit: int = 100):
        query = self.db.query(ContatoModel)
        
        if search:
            query = query.filter(
                or_(
                    ContatoModel.nome.ilike(f"%{search}%"),
                    ContatoModel.telefone.ilike(f"%{search}%")
                )
            )
        
        # Aplica a paginação no final da query
        return query.order_by(
            ContatoModel.is_favorito.desc(), 
            ContatoModel.nome.asc()
        ).offset(skip).limit(limit).all()

    def obter_por_id(self, contato_id: int) -> ContatoModel:
        return self.db.query(ContatoModel).filter(ContatoModel.id == contato_id).first()

    def atualizar(self, contato_id: int, dados: ContatoUpdate) -> ContatoModel:
        db_contato = self.obter_por_id(contato_id)
        if db_contato:
            for key, value in dados.dict().items():
                setattr(db_contato, key, value)
            self.db.commit()
            self.db.refresh(db_contato)
        return db_contato

    def deletar(self, contato_id: int) -> bool:
        db_contato = self.obter_por_id(contato_id)
        if db_contato:
            self.db.delete(db_contato)
            self.db.commit()
            return True
        return False