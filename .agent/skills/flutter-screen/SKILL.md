---
name: Flutter Screen Generator
description: Flutter 화면(Screen) 생성 시 따라야 할 파일 구조와 코딩 규칙
---

# Flutter 화면 생성 스킬

새 화면을 만들 때 항상 아래 구조를 따르세요.

## 파일 구조

```
apps/mobile/lib/features/{feature-name}/
├── screens/
│   └── {feature-name}.screen.dart       # 화면 위젯
├── widgets/
│   ├── {widget-name}.widget.dart        # 하위 위젯
│   └── ...
├── providers/
│   └── {feature-name}.provider.dart     # Riverpod Provider
├── models/
│   └── {model-name}.model.dart          # 데이터 모델 (freezed 또는 직접)
└── services/
    └── {feature-name}.service.dart      # API 호출 서비스 (Dio)
```

## 규칙

1. **상태 관리**: Riverpod v2 사용
   - API 데이터 로드: `AsyncNotifierProvider` 또는 `FutureProvider`
   - UI 상태 (토글, 필터 등): `StateProvider` 또는 `StateNotifierProvider`
   - 실시간 스트림: `StreamProvider`

2. **네비게이션**: `go_router` 사용. 라우트 정의는 `core/router/` 에 집중

3. **네트워크**: `Dio` HTTP 클라이언트. `core/network/` 에 인터셉터 설정
   - JWT 자동 첨부 인터셉터
   - 토큰 만료 시 자동 갱신 (401 → refresh → retry)

4. **파일명**: kebab-case + 접미사
   - 화면: `spot-detail.screen.dart`
   - 위젯: `condition-card.widget.dart`
   - Provider: `spot-detail.provider.dart`
   - 모델: `spot.model.dart`
   - 서비스: `spot.service.dart`

5. **디자인 토큰**: `core/theme/` 에 정의된 컬러·타이포 토큰 사용
   - `AppColors.oceanBlue`, `AppColors.waveCyan` 등
   - 하드코딩 색상 금지

6. **Simple / Expert 뷰**: `viewModeProvider`로 뷰 모드 분기
   - Simple: 자연어 활동 결과만 표시
   - Expert: 전체 수치 + 그래프 (Pro 전용)

7. **반응형**: `MediaQuery` + `LayoutBuilder` 로 태블릿·폰 대응

## 예시 — Screen

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SpotDetailScreen extends ConsumerWidget {
  final String spotId;
  const SpotDetailScreen({super.key, required this.spotId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final spotAsync = ref.watch(spotDetailProvider(spotId));

    return Scaffold(
      body: spotAsync.when(
        data: (spot) => _buildContent(context, ref, spot),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('오류: $err')),
      ),
    );
  }
}
```

## 예시 — Provider

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

final spotDetailProvider = FutureProvider.family<Spot, String>((ref, spotId) async {
  final service = ref.read(spotServiceProvider);
  return service.getSpotDetail(spotId);
});
```
