import axios from "axios";

export async function embed(text: string): Promise<number[]>{
    const response = await axios.post('http://localhost:8000/embed', {
        texts: [text]
    });
    return response.data.embeddings[0]
}

// console.log(await embed("Hello world")) -> Tested, the embedding function works!