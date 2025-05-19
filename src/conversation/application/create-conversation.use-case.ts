import { Injectable } from '@nestjs/common';
import { ConversationService } from '../domain/service';

@Injectable()
export class CreateConversationUseCase {
	constructor(private readonly conversationService: ConversationService) { }

	async execute(userId: string, title?: string) {
		await this.conversationService.create(userId, title);

		const conversation =
			await this.conversationService.findLatestOneByUserId(userId);

		return conversation;
	}
}
