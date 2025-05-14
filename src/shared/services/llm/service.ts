import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

const AVAILABLE_MODELS = {
	'gpt-4.1': 'gpt-4.1',
	'gpt-4.1-mini': 'gpt-4.1-mini',
	'gpt-4.1-nano': 'gpt-4.1-nano',
	'gpt-4o-mini': 'gpt-4o-mini',
};
type AvailableModel = keyof typeof AVAILABLE_MODELS;

type OpenAiResponseData = {
	choices: {
		message: {
			content: string;
		};
	}[];
};

@Injectable()
export class LlmService {
	private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';

	constructor(
		private readonly httpService: HttpService,
		private readonly configService: ConfigService,
	) {}

	async generateAnswer(
		systemPrompt: string,
		userPrompt: string,
		model?: AvailableModel,
	): Promise<string> {
		const messages = [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: userPrompt },
		];
		if (!model) {
			model = await this.configService.get('OPENAI_DEFAULT_MODEL');
		}
		if (!(model ?? '' in AVAILABLE_MODELS)) {
			throw new Error(`Invalid model: ${model}`);
		}

		const response = await firstValueFrom(
			this.httpService.post(
				this.apiUrl,
				{ model, messages },
				{
					headers: {
						Authorization: `Bearer ${this.configService.get('OPENAI_API_KEY')}`,
					},
				},
			),
		);

		if (response.status !== 200) {
			throw new Error(`Error: ${response.statusText}`);
		}

		const data = response.data as OpenAiResponseData;
		if (!data.choices?.[0]?.message?.content) {
			throw new Error('No response from OpenAI');
		}

		return data.choices[0].message.content.trim();
	}
}
