import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalEmbeddingService {
	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {}

	async generateEmbedding(text: string): Promise<Float32Array> {
		const url = this.configService.get<string>('EXTERNAL_EMBEDDING_URL');
		if (!url) {
			throw new Error('EXTERNAL_EMBEDDING_URL is not set');
		}

		const response = await this.httpService.axiosRef.post(url, { text });

		if (response.status !== 200 && response.status !== 201) {
			throw new Error('Failed to generate embedding');
		}

		const data = (Array.isArray(response.data)
			? response.data
			: Object.values(response.data as never)) as unknown as Float32Array;

		return data;
	}
}
