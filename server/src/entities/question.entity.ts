import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  /** JSON array of option strings */
  @Column({ type: 'jsonb' })
  options: string[];

  @Column({ type: 'int' })
  correctIndex: number;

  @Column({ type: 'varchar', length: 64, default: 'basics' })
  category: string;

  @Column({ type: 'varchar', length: 16, default: 'medium' })
  difficulty: string;
}
