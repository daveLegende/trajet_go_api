import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...',
    description: 'Refresh token reçu lors de la connexion/inscription',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le refresh token est obligatoire' })
  refresh_token!: string;
}
