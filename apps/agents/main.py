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

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    payload: str

class SelfCorrection(BaseModel):
    conversations: list[list[role: str, payload: str]]
    existing_params: list[use_case, conv_rate, qualities, specs, outliers, rfc]


@app.post('/embed', response_model=EmbedResponse)
def embed(req: EmbedRequest):
    embeddings = model.encode(
        req.texts, normalize_embeddings=True
    ).tolist()
    return  { "embeddings": embeddings, "length": len(embeddings) }

#  context, existing-params
@app.post('/self-correction', )