import { Module } from '@nestjs/common';
import { EmbeddingService } from './service';

@Module({
	providers: [EmbeddingService],
	exports: [EmbeddingService],
})
export class EmbeddingModule {}
