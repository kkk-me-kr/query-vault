import { Injectable, OnModuleInit } from '@nestjs/common';
import {
	pipeline as createPipeline,
	FeatureExtractionPipeline,
} from '@xenova/transformers';

@Injectable()
export class EmbeddingService implements OnModuleInit {
	private pipeline: FeatureExtractionPipeline;
	private model = 'Xenova/bge-m3';

	async onModuleInit() {
		try {
			this.pipeline = await createPipeline<'feature-extraction'>(
				'feature-extraction',
				this.model,
			);
		} catch (error) {
			console.error('Error initializing embedding pipeline', error);
			throw error;
		}
	}

	async generateEmbedding(text: string): Promise<Float32Array> {
		const result = await this.pipeline(text, {
			pooling: 'mean',
			normalize: true,
		});

		const vectors = result.data as Float32Array;

		return vectors;
	}
}
