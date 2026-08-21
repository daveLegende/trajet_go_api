import { ApiProperty } from '@nestjs/swagger';

export class OtpResponseDto {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Code OTP envoyé avec succès (simulation : 1234)' })
  message!: string;

  @ApiProperty({ example: '2026-08-18T12:10:00.000Z' })
  expires_at!: string;
}
