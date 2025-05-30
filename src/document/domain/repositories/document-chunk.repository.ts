import { DocumentChunk } from '../entities/document-chunk.entity';

export type QueriedChunkType = Omit<DocumentChunk, 'embedding'> & {
	distance?: number;
};

export abstract class DocumentChunkRepository {
	abstract create(
		documentId: number,
		chunks: {
			index: number;
			content: string;
			embedding: number[];
			metadata?: Record<string, any> | null;
		}[],
	): Promise<void>;
	abstract findByDocumentId(documentId: number): Promise<QueriedChunkType[]>;
	abstract findSimilarInDocument(
		documentId: number,
		embeddings: number[][],
		topK: number,
	): Promise<QueriedChunkType[]>;
	abstract findSimilarInAllDocuments(
		embeddings: number[][],
		topK: number,
	): Promise<QueriedChunkType[]>;
	abstract deleteByDocumentId(documentId: number): Promise<void>;
	abstract checkChunkExists(documentId: number): Promise<boolean>;
}
