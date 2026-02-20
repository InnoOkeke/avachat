import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntentController } from './intent.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [],
  controllers: [AppController, IntentController],
  providers: [AppService, TransactionService],
})
export class AppModule { }
