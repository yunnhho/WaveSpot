import { Controller, Get, Patch, Delete, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회' })
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: '내 프로필 수정 (닉네임, 단위, 다크모드 등)' })
  updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.sub, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: '회원 탈퇴 (소프트 삭제)' })
  deleteMe(@Req() req: any) {
    return this.usersService.deleteMe(req.user.sub);
  }
}
