from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")

app = FastAPI(title="Python Server")

class EmbedRequest(BaseModel):
    texts: list[str]

class EmbedResponse(BaseModel):
    embeddings: list[list[float]]

@app.post('/embed', response_model=EmbedResponse)
def embed(req: EmbedRequest):
    embeddings = model.encode(
        req.texts, normalize_embeddings=True
    ).tolist()
    return  { "embeddings": embeddings, "length": len(embeddings) }

