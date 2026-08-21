import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../users/application/dto/user-response.dto';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access Token (durée de validité courte, ex: 15 min)',
  })
  access_token!: string;

  @ApiProperty({
    example: 'dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...',
    description: 'JWT Refresh Token (durée de validité longue, ex: 7 jours)',
  })
  refresh_token!: string;

  @ApiProperty({ example: 'Bearer' })
  token_type!: string;

  @ApiProperty({ example: 900, description: 'Durée en secondes de validité de l’access token' })
  expires_in!: number;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
