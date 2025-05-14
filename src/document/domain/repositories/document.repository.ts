import { Document } from '../entities/document.entity';

export abstract class DocumentRepository {
	abstract create(
		title: string,
		content: string,
		source: string,
		documentTypeId?: number | null,
	): Promise<void>;
	abstract findById(id: number): Promise<Document | null>;
	abstract findAll(): Promise<Document[]>;
	abstract update(document: Document): Promise<void>;
	abstract delete(id: number): Promise<void>;
}
