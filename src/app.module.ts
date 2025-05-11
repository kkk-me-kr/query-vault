import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConversationModule } from './conversation/module';
import { TypeOrmConfigModule } from './shared/persistence/typeorm.module';
import { ConfigModule } from '@nestjs/config';

const domainModules = [ConversationModule];

const sharedModules = [TypeOrmConfigModule];

@Module({
	imports: [ConfigModule.forRoot(), ...domainModules, ...sharedModules],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
