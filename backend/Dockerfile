# Usa uma imagem oficial leve do Python
FROM python:3.11-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Variáveis de ambiente para evitar criação de arquivos .pyc e logs em buffer
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala dependências do sistema necessárias para compilar drivers (se precisar)
RUN apt-get update && apt-get install -y build-essential libssl-dev libffi-dev default-libmysqlclient-dev \
    && apt-get clean

# Copia o arquivo de requisitos e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código
COPY . .

# Expõe a porta (apenas informativo)
EXPOSE 8000

# Comando para rodar a aplicação
# --host 0.0.0.0 é OBRIGATÓRIO dentro do Docker para ser acessível de fora
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]