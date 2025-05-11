import { Injectable } from '@nestjs/common';
import { ConversationService } from '../domain/service';

@Injectable()
export class GetAnswersUseCase {
	constructor(private readonly conversationService: ConversationService) {}

	async execute(conversationId: number) {
		return this.conversationService.findAnswersByConversationId(conversationId);
	}
}
