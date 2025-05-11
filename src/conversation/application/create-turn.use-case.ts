import { Injectable } from '@nestjs/common';
import { ConversationService } from '../domain/service';

@Injectable()
export class CreateTurnUseCase {
	constructor(private readonly conversationService: ConversationService) {}

	async execute(conversationId: number, query: string) {
		const nextTurn =
			await this.conversationService.findNextTurn(conversationId);

		await this.conversationService.postQuestion(
			conversationId,
			nextTurn,
			query,
		);

		// TODO: 질문에 대한 답변을 생성할 수 있어야 합니다.
		const answer = '아주 멋진 답변일겁니다.';

		await this.conversationService.postAnswer(conversationId, nextTurn, answer);

		return answer;
	}
}
