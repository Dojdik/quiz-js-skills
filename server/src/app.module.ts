import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Question } from './questions/question.entity';
import { QuestionsModule } from './questions/questions.module';
import { Result } from './results/result.entity';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'data', 'quiz.sqlite'),
      entities: [Question, Result],
      synchronize: true,
    }),
    QuestionsModule,
    ResultsModule,
  ],
})
export class AppModule {}
