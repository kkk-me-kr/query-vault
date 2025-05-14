import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class PutDocumentChunkDto {
	// NOTE: 청크들에 대한 메타데이터를 입력하고 싶은 경우 이용
	@IsObject()
	@IsOptional()
	metadata?: Record<string, any>;

	@IsString()
	@MaxLength(50)
	@IsOptional()
	chunkPrefix?: string;
}
