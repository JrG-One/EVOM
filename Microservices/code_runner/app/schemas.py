from pydantic import BaseModel
from typing import Optional, List

class ExecutionRequest(BaseModel):
    language: str
    code: str
    input_data: Optional[str] = ""

class ExecutionResponse(BaseModel):
    stdout: str
    stderr: str
    exit_code: int
    error: Optional[str] = None
