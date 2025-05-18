import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmbeddingService } from './service';
import { ExternalEmbeddingService } from './external.service';
import { ConfigModule } from '@nestjs/config';

// NOTE: 서버 자원이 충분하다면, InternalEmbeddingService를 사용하세요.
const embeddingService = {
	provide: EmbeddingService,
	useClass: ExternalEmbeddingService,
	// useClass: InternalEmbeddingService,
};

@Module({
	imports: [HttpModule, ConfigModule],
	providers: [embeddingService],
	exports: [embeddingService],
})
export class EmbeddingModule {}
