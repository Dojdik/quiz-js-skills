import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities';
import { QUIZ_SEED } from './questions.seed';

export type PublicQuestion = Omit<Question, 'correctIndex'>;

@Injectable()
export class QuestionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepo: Repository<Question>,
  ) {}

  async onModuleInit() {
    const count = await this.questionsRepo.count();
    if (count === 0) {
      await this.questionsRepo.save(QUIZ_SEED.map((q) => this.questionsRepo.create(q)));
    }
  }

  async findAllPublic(): Promise<PublicQuestion[]> {
    const questions = await this.questionsRepo.find({ order: { id: 'ASC' } });
    return questions.map(({ correctIndex: _, ...rest }) => rest);
  }

  async findAll(): Promise<Question[]> {
    return this.questionsRepo.find({ order: { id: 'ASC' } });
  }

  async findByIds(ids: number[]): Promise<Question[]> {
    if (ids.length === 0) return [];
    return this.questionsRepo
      .createQueryBuilder('q')
      .where('q.id IN (:...ids)', { ids })
      .getMany();
  }
}
