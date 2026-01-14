from fastapi import FastAPI, Header, HTTPException, Depends
from .schemas import ExecutionRequest, ExecutionResponse
from .executor import run_code_in_docker
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

SERVICE_SECRET = os.getenv("SERVICE_SECRET", "default_secret_change_me")

async def verify_token(x_service_token: str = Header(...)):
    if x_service_token != SERVICE_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Service Token")

@app.post("/execute", response_model=ExecutionResponse, dependencies=[Depends(verify_token)])
async def execute_code(request: ExecutionRequest):
    result = run_code_in_docker(request.language, request.code, request.input_data)
    return result

@app.get("/health")
async def health_check():
    return {"status": "ok"}
