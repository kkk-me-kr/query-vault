import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
	@IsNumber()
	@IsOptional()
	contentTypeId?: number;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsOptional()
	content?: string;

	@IsString()
	@IsNotEmpty()
	source: string;
}
