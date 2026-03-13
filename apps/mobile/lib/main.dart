import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// ============================================================
// WAVESPOT 디자인 토큰 (TDD v1.1 Section 1 기반)
// ============================================================
class WavespotColors {
  static const oceanBlue = Color(0xFF0C3B6E);
  static const waveCyan  = Color(0xFF07C0D4);
  static const seaSand   = Color(0xFFF0EDE5);

  static const backgroundLight = seaSand;
  static const surfaceLight     = Color(0xFFFFFFFF);
  static const textSecondary    = Color(0xFF64748B);

  static const backgroundDark  = Color(0xFF0D1B2A);
  static const surfaceDark     = Color(0xFF1A2E44);
  static const primaryDark     = Color(0xFF3B82F6);
  static const textPrimaryDark = Color(0xFFF1F5F9);

  static const excellent = Color(0xFF10B981);
  static const good      = Color(0xFF3B82F6);
  static const fair      = Color(0xFFF59E0B);
  static const poor      = Color(0xFFEF4444);
}

// ============================================================
// 라우터 설정
// ============================================================
final _router = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/map',
      builder: (context, state) => const MapPlaceholderScreen(),
    ),
  ],
);

// ============================================================
// 앱 진입점
// ============================================================
void main() {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  runApp(
    const ProviderScope(
      child: WavespotApp(),
    ),
  );
}

// ============================================================
// 루트 앱 위젯
// ============================================================
class WavespotApp extends StatelessWidget {
  const WavespotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'WAVESPOT',
      debugShowCheckedModeBanner: false,
      routerConfig: _router,
      theme: _buildLightTheme(),
      darkTheme: _buildDarkTheme(),
      themeMode: ThemeMode.system,
    );
  }

  ThemeData _buildLightTheme() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: WavespotColors.oceanBlue,
        brightness: Brightness.light,
        primary: WavespotColors.oceanBlue,
        secondary: WavespotColors.waveCyan,
        surface: WavespotColors.seaSand,
      ),
      scaffoldBackgroundColor: WavespotColors.seaSand,
      appBarTheme: const AppBarTheme(
        backgroundColor: WavespotColors.oceanBlue,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: Colors.white,
          fontSize: 18,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: WavespotColors.oceanBlue,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        ),
      ),
    );
  }

  ThemeData _buildDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: WavespotColors.oceanBlue,
        brightness: Brightness.dark,
        primary: WavespotColors.primaryDark,
        secondary: WavespotColors.waveCyan,
        surface: WavespotColors.surfaceDark,
      ),
      scaffoldBackgroundColor: WavespotColors.backgroundDark,
      appBarTheme: const AppBarTheme(
        backgroundColor: WavespotColors.surfaceDark,
        foregroundColor: WavespotColors.textPrimaryDark,
        elevation: 0,
        centerTitle: true,
      ),
    );
  }
}

// ============================================================
// 스플래시 화면 (S-01)
// ============================================================
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );
    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );

    _controller.forward();

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) context.go('/map');
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: WavespotColors.oceanBlue,
      body: Center(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: WavespotColors.waveCyan,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: WavespotColors.waveCyan.withOpacity(0.4),
                        blurRadius: 24,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: const Icon(Icons.waves, size: 56, color: Colors.white),
                ),
                const SizedBox(height: 24),
                const Text(
                  'WAVESPOT',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 4,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '수상 스포츠 컨디션, 한눈에',
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.75),
                    fontSize: 15,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ============================================================
// 메인 지도 화면 플레이스홀더 (S-03)
// Phase 1 MVP: 네이버 지도 + 스팟 마커 + 바텀시트 구현 예정
// ============================================================
class MapPlaceholderScreen extends StatelessWidget {
  const MapPlaceholderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WAVESPOT'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () {},
            tooltip: '마이페이지',
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.map_outlined,
              size: 80,
              color: WavespotColors.waveCyan.withOpacity(0.5),
            ),
            const SizedBox(height: 20),
            const Text(
              '🌊 지도 화면',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              '네이버 지도 API 키 설정 후 활성화됩니다.\nPhase 1 MVP 구현 예정',
              textAlign: TextAlign.center,
              style: TextStyle(color: WavespotColors.textSecondary),
            ),
            const SizedBox(height: 32),
            _buildGradeRow(),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.map_outlined),
            selectedIcon: Icon(Icons.map),
            label: '지도',
          ),
          NavigationDestination(
            icon: Icon(Icons.favorite_outline),
            selectedIcon: Icon(Icons.favorite),
            label: '즐겨찾기',
          ),
          NavigationDestination(
            icon: Icon(Icons.people_outline),
            selectedIcon: Icon(Icons.people),
            label: '커뮤니티',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: '마이',
          ),
        ],
      ),
    );
  }

  Widget _buildGradeRow() {
    final grades = [
      ('EXCELLENT', WavespotColors.excellent),
      ('GOOD', WavespotColors.good),
      ('FAIR', WavespotColors.fair),
      ('POOR', WavespotColors.poor),
    ];
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: grades.map((g) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 6),
          child: Chip(
            backgroundColor: g.$2.withOpacity(0.15),
            side: BorderSide(color: g.$2, width: 1.5),
            label: Text(
              g.$1,
              style: TextStyle(
                color: g.$2,
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}
