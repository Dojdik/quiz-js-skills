import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from '../questions/questions.module';
import { Result } from '../entities';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

@Module({
  imports: [TypeOrmModule.forFeature([Result]), QuestionsModule],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
