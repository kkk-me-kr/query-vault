import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationService } from '../domain/service';

@Injectable()
export class GetTurnPairsUseCase {
	constructor(private readonly conversationService: ConversationService) {}

	async execute(conversationId: number, userId: string) {
		if (!await this.conversationService.checkExists(conversationId, userId)) {
			throw new NotFoundException('Conversation not found');
		}
		return this.conversationService.findAllTurns(conversationId);
	}
}
