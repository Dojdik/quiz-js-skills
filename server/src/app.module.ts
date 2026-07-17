import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './questions/question.entity';
import { QuestionsModule } from './questions/questions.module';
import { Result } from './results/result.entity';
import { ResultsModule } from './results/results.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USER', 'quiz'),
        password: config.get<string>('DB_PASSWORD', 'quiz'),
        database: config.get<string>('DB_NAME', 'quiz'),
        entities: [Question, Result],
        synchronize: true,
      }),
    }),
    QuestionsModule,
    ResultsModule,
  ],
})
export class AppModule {}
