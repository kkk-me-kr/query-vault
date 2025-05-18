import { Injectable } from '@nestjs/common';
import {
	pipeline as createPipeline,
	FeatureExtractionPipeline,
} from '@xenova/transformers';

@Injectable()
export class EmbeddingService {
	private pipeline: FeatureExtractionPipeline;
	private model = 'Xenova/bge-m3';

	async createPipeline() {
		this.pipeline = await createPipeline<'feature-extraction'>(
			'feature-extraction',
			this.model,
		);
	}

	async generateEmbedding(text: string): Promise<Float32Array> {
		if (!this.pipeline) {
			await this.createPipeline();
		}

		const result = await this.pipeline(text, {
			pooling: 'mean',
			normalize: true,
		});

		const vectors = result.data as Float32Array;

		return vectors;
	}
}
