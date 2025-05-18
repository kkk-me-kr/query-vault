export abstract class EmbeddingService {
	abstract generateEmbedding(text: string): Promise<Float32Array>;
}
