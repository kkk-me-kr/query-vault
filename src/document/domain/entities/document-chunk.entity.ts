export class DocumentChunk {
	// PK: documentId, index
	documentId: number;
	index: number;
	content: string;
	embedding: number[];
	metadata?: Record<string, any> | null;
}
