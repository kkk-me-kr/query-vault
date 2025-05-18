import { Injectable, NotFoundException } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { DocumentChunkService } from '../domain/services/document-chunk.service';
import { DocumentService } from '../domain/services/document.service';
import { EmbeddingService } from '@/shared/services/embedding/service';

@Injectable()
export class PutDocumentChunkUseCase {
	constructor(
		private readonly documentService: DocumentService,
		private readonly documentChunkService: DocumentChunkService,
		private readonly embeddingService: EmbeddingService,
	) {}

	async execute(
		documentId: number,
		{
			chunkPrefix,
			metadata,
		}: { chunkPrefix?: string; metadata?: Record<string, any> },
	) {
		const document = await this.documentService.findDocument(documentId);
		if (!document) {
			throw new NotFoundException('Document not found');
		}

		const chunkSize = 1500;
		const chunkOverlap = chunkSize * 0.2;

		const textSplitter = new RecursiveCharacterTextSplitter({
			chunkSize,
			chunkOverlap,
			separators: [
				...RecursiveCharacterTextSplitter.getSeparatorsForLanguage('markdown'),
			],
			keepSeparator: false,
		});

		let chunkTexts = await textSplitter.splitText(document.content);
		// NOTE: 청크 접두사를 추가합니다.
		if (chunkPrefix) {
			const seperator = '\n\n';
			chunkTexts = chunkTexts.map(chunk => chunkPrefix + seperator + chunk);
		}

		const chunckedData = await Promise.all(
			chunkTexts.map(async chunkText => {
				const embedding =
					await this.embeddingService.generateEmbedding(chunkText);
				return {
					content: chunkText,
					embedding: Array.from(embedding),
					metadata: {
						...(metadata || {}),
					},
				};
			}),
		);

		// NOTE: 기존에 청크가 있는 경우 삭제될겁니다.
		await this.documentChunkService.deleteDocumentChunks(documentId);

		await this.documentChunkService.createDocumentChunks(
			documentId,
			chunckedData,
		);
	}
}
