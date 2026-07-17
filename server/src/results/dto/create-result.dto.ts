import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateResultDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  playerName: string;

  /** Map of questionId (string) -> selected option index */
  @IsObject()
  answers: Record<string, number>;

  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpentSeconds?: number;
}
