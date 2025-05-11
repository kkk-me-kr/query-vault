import { Injectable } from '@nestjs/common';
import { ConversationService } from '../domain/service';

@Injectable()
export class GetTurnPairsUseCase {
	constructor(private readonly conversationService: ConversationService) {}

	async execute(conversationId: number, turn: number) {
		return this.conversationService.findPairsByConversationTurn(
			conversationId,
			turn,
		);
	}
}
