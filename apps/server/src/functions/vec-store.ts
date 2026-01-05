import { QdrantClient } from "@qdrant/qdrant-js";
import dotenv from 'dotenv';

dotenv.config();

export const vecDB_client = new QdrantClient({
    url: `${process.env.VEC_DB_URL}`,
    apiKey: `${process.env.VEC_DB_API_KEY}`
});

export async function initCollection() {
    await vecDB_client.createCollection("KB_Usecase_Vec", {
        vectors: {
            size: 384,
            distance: "Cosine"
        }
    });
}

try {
    const result = await vecDB_client.getCollections();
    console.log('[VECTOR COLLECTIONS SUCCESS]: ' + result.collections);
} catch(err) {
    console.error('[VECTOR COLLECTIONS ERROR]: Could not fetch connections.');
}

// const create = await initCollection();
// console.log("[VEC-DB CREATED]: " + create); VEC-DB Created