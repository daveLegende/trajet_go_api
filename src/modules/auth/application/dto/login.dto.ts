import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'koffi.abalo@example.com',
    description: 'Email ou numéro de téléphone (+22890123456)',
  })
  @IsString()
  @IsNotEmpty({ message: 'L’identifiant (email ou téléphone) est requis' })
  identifier!: string;

  @ApiProperty({
    example: 'MotDePasseFort123!',
    description: 'Mot de passe du compte',
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  mot_de_passe!: string;
}
