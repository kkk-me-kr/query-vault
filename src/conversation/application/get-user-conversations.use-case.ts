import { Injectable } from '@nestjs/common';
import { ConversationService } from '../domain/service';
import { Conversation } from '../domain/entities/conversation.entity';

@Injectable()
export class GetUserConversationsUseCase {
	constructor(private readonly conversationService: ConversationService) {}

	async execute(userId: string): Promise<Conversation[]> {
		return this.conversationService.findByUserId(userId);
	}
}
