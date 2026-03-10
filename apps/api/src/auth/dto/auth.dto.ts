import { IsEmail, IsString, MinLength, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DevLoginDto {
  @ApiProperty({ example: 'test@wavespot.kr' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test1234' })
  @IsString()
  @MinLength(4)
  password: string;
}

export class SocialLoginDto {
  @ApiProperty({ description: '소셜 SDK에서 받은 액세스 토큰' })
  @IsString()
  accessToken: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
