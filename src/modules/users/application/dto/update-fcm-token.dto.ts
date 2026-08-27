import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFcmTokenDto {
  @ApiProperty({
    description: 'Token FCM Firebase du device Flutter pour les notifications push',
    example: 'dGhpcyBpcyBhIHNhbXBsZSBGQ00gdG9rZW4...',
  })
  @IsNotEmpty()
  @IsString()
  @Length(10, 512)
  fcmToken: string;
}
