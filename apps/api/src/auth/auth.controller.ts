import {
  Controller, Post, Delete, Body, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { DevLoginDto, SocialLoginDto, RefreshTokenDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 개발용 이메일 로그인 (API 키 없이 테스트)
   * password: 'dev_' + email 앞 4자리 또는 'wavespot2026'
   */
  @Post('dev-login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '개발용 로그인 (소셜 키 없이 테스트)', description: 'password: wavespot2026' })
  devLogin(@Body() dto: DevLoginDto) {
    return this.authService.devLogin(dto.email, dto.password);
  }

  @Post('kakao')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '카카오 소셜 로그인' })
  kakaoLogin(@Body() dto: SocialLoginDto) {
    return this.authService.kakaoLogin(dto.accessToken);
  }

  @Post('google')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '구글 소셜 로그인' })
  googleLogin(@Body() dto: SocialLoginDto) {
    return this.authService.googleLogin(dto.accessToken);
  }

  @Post('apple')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '애플 소셜 로그인' })
  appleLogin(@Body() dto: SocialLoginDto) {
    return this.authService.appleLogin(dto.accessToken);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Access Token 갱신' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Delete('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그아웃' })
  logout(@Req() req: any) {
    return this.authService.logout(req.user?.sub);
  }
}
