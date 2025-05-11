import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConversationModule } from './conversation/module';

const domainModules = [ConversationModule];
@Module({
	imports: [...domainModules],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
