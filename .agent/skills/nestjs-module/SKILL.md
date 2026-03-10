---
name: NestJS Module Generator
description: NestJS 모듈 생성 시 따라야 할 파일 구조와 코딩 규칙
---

# NestJS 모듈 생성 스킬

새 모듈을 만들 때 항상 아래 구조를 따르세요.

## 파일 구조

```
apps/api/src/{module-name}/
├── {module-name}.module.ts
├── {module-name}.controller.ts
├── {module-name}.service.ts
├── dto/
│   ├── create-{name}.dto.ts
│   └── update-{name}.dto.ts
├── entities/
│   └── {name}.entity.ts
└── __tests__/
    └── {module-name}.service.spec.ts
```

## 규칙

1. **Module**: `@Module()` 데코레이터로 선언. `imports`, `controllers`, `providers`, `exports` 명시
2. **Controller**: 얇게 유지 — 라우팅과 요청/응답 변환만 담당. 비즈니스 로직은 Service에 위임
3. **Service**: 모든 비즈니스 로직 집중. Prisma를 주입받아 DB 접근
4. **Entity/Model**: Prisma 스키마(`schema.prisma`)에 모델 정의. TypeScript 인터페이스로 타입 보조
5. **DTO**: `class-validator` 데코레이터로 모든 입력 검증
   - `@IsString()`, `@IsNumber()`, `@IsEnum()`, `@IsOptional()` 등 활용
   - `@ApiProperty()` (Swagger) 데코레이터 함께 사용
6. **테스트**: Jest 기반 단위 테스트. Service의 핵심 비즈니스 로직 100% 커버리지 목표
7. **주석**: 모든 Public 메서드에 JSDoc 주석 작성
8. **Guard 적용**:
   - Public 엔드포인트: `@Public()` 데코레이터
   - Pro 전용: `@UseGuards(ProGuard)`
   - 관리자 전용: `@UseGuards(AdminGuard)`

## 예시 — DTO

```typescript
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpotDto {
  @ApiProperty({ description: '스팟 한국어 명칭' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '종목 배열', example: ['surfing', 'kayak'] })
  @IsArray()
  @IsString({ each: true })
  spotTypes: string[];

  @ApiProperty({ description: '지역', enum: ['east_sea', 'west_sea', 'south_sea', 'inland'] })
  @IsEnum(['east_sea', 'west_sea', 'south_sea', 'inland'])
  region: string;
}
```

## 예시 — Controller

```typescript
@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Get()
  @Public()
  async findAll(@Query() query: FindSpotsDto) {
    return this.spotsService.findAll(query);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() dto: CreateSpotDto) {
    return this.spotsService.create(dto);
  }
}
```
