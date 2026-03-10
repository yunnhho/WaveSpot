import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, nickname: true, avatarUrl: true,
        role: true, plan: true, skillLevel: true,
        unitWind: true, unitWave: true, darkMode: true,
        createdAt: true,
        _count: { select: { favorites: true } },
      },
    });
    if (!user) throw new NotFoundException({ code: 'SPOT_NOT_FOUND', message: '사용자를 찾을 수 없습니다.' });
    return user;
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true, email: true, nickname: true, plan: true,
        skillLevel: true, unitWind: true, unitWave: true, darkMode: true,
      },
    });
  }

  async deleteMe(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
    return { success: true, message: '탈퇴가 완료되었습니다.' };
  }
}
