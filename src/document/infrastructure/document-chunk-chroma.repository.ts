import { Injectable, OnModuleInit } from '@nestjs/common';
import { ChromaClient, Collection, QueryResponse } from 'chromadb';
import {
	DocumentChunkRepository,
	QueriedChunkType,
} from '../domain/repositories/document-chunk.repository';

@Injectable()
export class DocumentChunkChromaRepository
	extends DocumentChunkRepository
	implements OnModuleInit
{
	private client: ChromaClient;
	private collection: Collection;
	private readonly collectionName = 'document_chunks';

	async onModuleInit() {
		try {
			this.client = new ChromaClient();
			this.collection = await this.client.getOrCreateCollection({
				name: this.collectionName,
				metadata: {
					description: 'Document chunks',
					model: 'Xenova/bge-m3',
					dimensions: 1024,
					createdAt: new Date().toISOString(),
				},
			});
		} catch (error) {
			console.error('Error initializing Chroma collection', error);
			throw error;
		}
	}

	private queryToEntities(response: QueryResponse): QueriedChunkType[] {
		const numQueries = Array.isArray(response.ids) ? response.ids.length : 0;
		let results: QueriedChunkType[] = [];

		for (let q = 0; q < numQueries; q++) {
			const ids = Array.isArray(response.ids[q])
				? (response.ids[q] as string[])
				: [];
			const metadatas = Array.isArray(response.metadatas[q])
				? (response.metadatas[q] as any[])
				: [];
			const documents = Array.isArray(response.documents[q])
				? (response.documents[q] as string[])
				: [];
			const distances = Array.isArray(response.distances?.[q])
				? (response.distances[q] as number[])
				: [];

			const chunks: QueriedChunkType[] = ids.map((id, index) => {
				const metadata = metadatas[index] as Record<
					string,
					string | number | boolean
				>;
				if (!metadata || typeof metadata !== 'object') {
					throw new Error('Invalid metadata');
				}
				const documentId = Number(metadata.documentId);
				const chunkIndex = Number(metadata.index);
				const content = documents[index];
				if (typeof content !== 'string') {
					throw new Error('Invalid content');
				}
				const extraMetadata = {
					...metadata,
				};
				delete extraMetadata.documentId;
				delete extraMetadata.index;

				return {
					documentId,
					index: chunkIndex,
					content,
					distance: distances[index],
					metadata: extraMetadata,
				};
			});
			results = chunks;
		}
		return results;
	}

	async create(
		documentId: number,
		chunks: {
			index: number;
			content: string;
			embedding: number[];
			metadata?: Record<string, any> | null;
		}[],
	): Promise<void> {
		await this.collection.add({
			ids: chunks.map(chunk => `${documentId}-${chunk.index}`),
			metadatas: chunks.map(chunk => ({
				documentId,
				index: chunk.index,
				...(chunk.metadata || {}),
			})),
			documents: chunks.map(chunk => chunk.content),
			embeddings: chunks.map(chunk => chunk.embedding),
		});
	}

	async findByDocumentId(documentId: number): Promise<QueriedChunkType[]> {
		const results = await this.collection.get({
			where: {
				documentId,
			},
		});

		if (!Array.isArray(results.ids)) {
			throw new Error('Invalid response format');
		}

		return results.ids.map((id, index) => {
			const metadata = results.metadatas[index];
			if (!metadata || typeof metadata !== 'object') {
				throw new Error('Invalid metadata');
			}

			const chunkIndex = Number(metadata.index);
			const content = results.documents[index];

			if (typeof content !== 'string') {
				throw new Error('Invalid content');
			}

			const extraMetadata = {
				...metadata,
			};
			delete extraMetadata.documentId;
			delete extraMetadata.index;

			return {
				documentId,
				index: chunkIndex,
				content,
				metadata: extraMetadata,
			};
		});
	}

	async findSimilarInDocument(
		documentId: number,
		embeddings: number[][],
		topK: number,
	): Promise<QueriedChunkType[]> {
		const results = await this.collection.query({
			queryEmbeddings: embeddings,
			nResults: topK,
			where: {
				documentId,
			},
		});
		return this.queryToEntities(results);
	}

	async findSimilarInAllDocuments(
		embeddings: number[][],
		topK: number,
	): Promise<QueriedChunkType[]> {
		const results = await this.collection.query({
			queryEmbeddings: embeddings,
			nResults: topK,
		});
		return this.queryToEntities(results);
	}

	async deleteByDocumentId(documentId: number): Promise<void> {
		await this.collection.delete({
			where: {
				documentId,
			},
		});
	}

	async addChunk(
		documentId: number,
		index: number,
		content: string,
		embedding: number[],
	): Promise<void> {
		await this.collection.add({
			ids: [`${documentId}-${index}`],
			metadatas: [
				{
					documentId,
					index,
				},
			],
			documents: [content],
			embeddings: [embedding],
		});
	}

	async querySimilar(embedding: number[], topK = 5) {
		const results = await this.collection.query({
			queryEmbeddings: [embedding],
			nResults: topK,
		});
		return results;
	}

	async checkChunkExists(documentId: number): Promise<boolean> {
		const results = await this.collection.get({
			where: {
				documentId,
			},
		});
		return results.ids.length > 0;
	}
}
