import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('results')
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  playerName: string;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  total: number;

  /** Percentage 0–100 */
  @Column({ type: 'double precision' })
  percentage: number;

  /** JSON: selected answers map questionId -> optionIndex */
  @Column({ type: 'jsonb', nullable: true })
  answers: Record<string, number> | null;

  @CreateDateColumn()
  createdAt: Date;
}
