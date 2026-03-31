# ARCHITECT AI - Backend API

The core backend for the Architect AI Productivity system. Built with FastAPI and PostgreSQL.

## Features
- JWT Authentication (Login/Register)
- User Profile management (Base64 Profile Images)
- Task Management CRUD
- AI Integration (OpenAI)
- Productivity Statistics

## Tech Stack
- **Framework**: FastAPI
- **Language**: Python 3.10+
- **Database**: PostgreSQL / SQLAlchemy
- **Environment**: Pydantic Settings

## Setup Instructions

1. **Environment Variables**:
   Create a `.env` file in this directory based on the following template:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/architect_db
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=43200
   OPENAI_API_KEY=sk-xxxx...
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Server**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

## API Documentation
Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc
