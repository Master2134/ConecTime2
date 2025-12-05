from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base
from app.routes import contato_routes, auth_routes # <--- Add auth_routes
from app.models.usuario_model import UsuarioModel  # <--- Add UsuarioModel

# Cria tabelas (Contatos + Usuários)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BitFlow Connect API", version="2.0.0")

# CORS - lista explícita para evitar bloqueios em dev
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://26.25.48.234:3000",
    "http://26.25.48.234:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(auth_routes.router, prefix="/auth", tags=["Autenticação"])
app.include_router(contato_routes.router, prefix="/contatos", tags=["Contatos"])

@app.get("/", tags=["Status"])
def read_root():
    return {"status": "online", "version": "2.0.0"}