import { BadRequestException, Injectable } from '@nestjs/common';
import {
	DocumentChunkRepository,
	QueriedChunkType,
} from '../repositories/document-chunk.repository';

@Injectable()
export class DocumentChunkService {
	constructor(
		private readonly documentChunkRepository: DocumentChunkRepository,
	) {}

	async createDocumentChunks(
		documentId: number,
		chunks: {
			content: string;
			embedding: number[];
			metadata?: Record<string, any> | null;
		}[],
	): Promise<void> {
		if (await this.documentChunkRepository.checkChunkExists(documentId)) {
			throw new BadRequestException('Document chunks already exist');
		}

		const insertChunks = chunks.map((chunk, index) => ({
			index,
			content: chunk.content,
			embedding: chunk.embedding,
			metadata: chunk.metadata,
		}));
		await this.documentChunkRepository.create(documentId, insertChunks);
	}

	async deleteDocumentChunks(documentId: number): Promise<void> {
		await this.documentChunkRepository.deleteByDocumentId(documentId);
	}

	async findSimilarChunksInDocument(
		documentId: number,
		embeddings: number[][],
		topK: number,
	): Promise<QueriedChunkType[]> {
		return this.documentChunkRepository.findSimilarInDocument(
			documentId,
			embeddings,
			topK,
		);
	}

	async findSimilarChunksInAllDocuments(
		embeddings: number[][],
		topK: number,
	): Promise<QueriedChunkType[]> {
		return this.documentChunkRepository.findSimilarInAllDocuments(
			embeddings,
			topK,
		);
	}
}
