import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AVAILABLE_MODELS = {
	'gpt-4.1': 'gpt-4.1',
	'gpt-4.1-mini': 'gpt-4.1-mini',
	'gpt-4.1-nano': 'gpt-4.1-nano',
	'gpt-4o-mini': 'gpt-4o-mini',
};
type AvailableModel = keyof typeof AVAILABLE_MODELS;

@Injectable()
export class LlmService {
	private readonly openai: OpenAI;

	constructor(private readonly configService: ConfigService) {
		this.openai = new OpenAI({
			apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
		});
	}

	async generateAnswer(
		systemPrompt: string,
		userPrompt: string,
		model?: AvailableModel,
	): Promise<string> {
		model =
			model || this.configService.get<AvailableModel>('OPENAI_DEFAULT_MODEL');
		if (!model) {
			throw new Error(`Invalid model: ${model}`);
		}

		const response = await this.openai.chat.completions.create({
			model,
			messages: [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userPrompt },
			],
			// NOTE: 결과를 당분간 지켜보기 위해 출력을 일정히 합니다.
			temperature: 0,
			presence_penalty: 0.0,
			frequency_penalty: 0.0,
			max_tokens: 1024,
		});

		const content = response.choices?.[0]?.message?.content;
		if (!content) {
			throw new Error('No response from OpenAI');
		}

		return content.trim();
	}
}
