import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class PutDocumentChunkDto {
	// NOTE: 청킹을 특수한 구분자로만 요청하고 싶은 경우 이용
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	seperators?: string[];

	// NOTE: 청크들에 대한 메타데이터를 입력하고 싶은 경우 이용
	@IsObject()
	@IsOptional()
	metadata?: Record<string, any>;
}
