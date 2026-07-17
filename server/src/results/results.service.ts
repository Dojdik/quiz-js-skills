import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionsService } from '../questions/questions.service';
import { CreateResultDto } from './dto/create-result.dto';
import { Result } from '../entities';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private readonly resultsRepo: Repository<Result>,
    private readonly questionsService: QuestionsService,
  ) {}

  async create(dto: CreateResultDto) {
    const questions = await this.questionsService.findAll();
    const total = questions.length;

    let score = 0;
    for (const q of questions) {
      const selected = dto.answers[String(q.id)];
      if (selected === q.correctIndex) {
        score += 1;
      }
    }

    const percentage = total === 0 ? 0 : Math.round((score / total) * 10000) / 100;

    const result = this.resultsRepo.create({
      playerName: dto.playerName.trim(),
      score,
      total,
      percentage,
      answers: dto.answers,
    });

    const saved = await this.resultsRepo.save(result);

    return {
      id: saved.id,
      playerName: saved.playerName,
      score: saved.score,
      total: saved.total,
      percentage: saved.percentage,
      createdAt: saved.createdAt,
      breakdown: questions.map((q) => ({
        questionId: q.id,
        correct: dto.answers[String(q.id)] === q.correctIndex,
        correctIndex: q.correctIndex,
        selectedIndex: dto.answers[String(q.id)] ?? null,
      })),
    };
  }

  async findAll(limit = 20) {
    return this.resultsRepo.find({
      order: { percentage: 'DESC', createdAt: 'DESC' },
      take: Math.min(limit, 100),
      select: {
        id: true,
        playerName: true,
        score: true,
        total: true,
        percentage: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    return this.resultsRepo.findOne({ where: { id } });
  }
}
