import { Injectable } from '@nestjs/common';
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
		chunkedData: {
			content: string;
			embedding: number[];
		}[],
	): Promise<void> {
		let index = 0;
		for (const chunk of chunkedData) {
			await this.documentChunkRepository.create(
				documentId,
				index,
				chunk.content,
				chunk.embedding,
			);
			index++;
		}
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
