import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 'connected', enum: ['connected', 'disconnected'] })
  database!: 'connected' | 'disconnected';

  @ApiProperty({ example: '2026-08-17T18:00:00.000Z' })
  timestamp!: string;
}
