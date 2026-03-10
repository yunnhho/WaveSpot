import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: '파도타는 사람' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ enum: ['beginner', 'intermediate', 'advanced'] })
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  @IsOptional()
  skillLevel?: string;

  @ApiPropertyOptional({ enum: ['ms', 'knots', 'kmh'] })
  @IsEnum(['ms', 'knots', 'kmh'])
  @IsOptional()
  unitWind?: string;

  @ApiPropertyOptional({ enum: ['m', 'ft'] })
  @IsEnum(['m', 'ft'])
  @IsOptional()
  unitWave?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  darkMode?: boolean;

  @ApiPropertyOptional({ description: 'FCM 디바이스 토큰' })
  @IsString()
  @IsOptional()
  fcmToken?: string;
}
