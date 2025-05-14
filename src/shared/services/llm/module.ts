import { Module } from '@nestjs/common';
import { LlmService } from './service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [HttpModule, ConfigModule],
	providers: [LlmService],
	exports: [LlmService],
})
export class LlmModule {}
