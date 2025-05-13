import { Document } from '../entities/document.entity';

export abstract class DocumentRepository {
	abstract create(
		title: string,
		content: string,
		source: string,
		documentTypeId?: number | null,
	): Promise<void>;
	abstract findById(id: number): Promise<Document>;
	abstract findAll(): Promise<Document[]>;
	abstract update(document: Document): Promise<Document>;
	abstract delete(id: number): Promise<void>;
}
