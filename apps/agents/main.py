from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Literal

model = SentenceTransformer("all-MiniLM-L6-v2")

app = FastAPI(title="Python Server")

#  these are te classes
class EmbedRequest(BaseModel):
    texts: list[str]

class EmbedResponse(BaseModel):
    embeddings: list[list[float]]

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    payload: str

class ExistingParams(BaseModel):
    use_case: str
    conv_rate: float
    qualities: List[str]
    specs: List[str]
    outliers: List[str]
    rfc: str

#  these are the api-endpoints
@app.post('/embed', response_model=EmbedResponse)
def embed(req: EmbedRequest):
    embeddings = model.encode(
        req.texts, normalize_embeddings=True
    ).tolist()
    return  { "embeddings": embeddings, "length": len(embeddings) }

