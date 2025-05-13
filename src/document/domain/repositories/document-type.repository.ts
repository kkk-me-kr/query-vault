import { DocumentType } from '../entities/document-type.entity';

export abstract class DocumentTypeRepository {
	abstract create(name: string, description?: string): Promise<void>;
	abstract findById(id: number): Promise<DocumentType | null>;
	abstract findByName(name: string): Promise<DocumentType | null>;
	abstract findAll(): Promise<DocumentType[]>;
	abstract update(documentType: DocumentType): Promise<void>;
	abstract delete(id: number): Promise<void>;
}
