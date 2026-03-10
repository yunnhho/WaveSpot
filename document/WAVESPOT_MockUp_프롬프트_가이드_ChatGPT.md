# 🌊 WAVESPOT — UI 프로토타입 이미지 생성 프롬프트 가이드

> **대상 툴:** ChatGPT (DALL-E 3)  
> **대응 문서:** SRS v1.3 · TDD v1.1  
> **작성일:** 2026  
> **총 화면 수:** 18개 (앱 15개 + 관리자 웹 3개)

---

## 📌 시작 전 필독 — ChatGPT DALL-E 3 사용 팁

### 사용 방법
ChatGPT에서 아래 프롬프트를 **그대로 복사해서 붙여넣기** 하면 됩니다.  
각 프롬프트는 영어로 작성되어 있으며, DALL-E 3에 최적화된 서술형 구조입니다.

### 주의사항

> ⚠️ **한글 텍스트는 정확히 렌더링되지 않습니다.**  
> 생성된 이미지를 Figma로 가져와 텍스트와 수치를 직접 편집하세요.

> ⚠️ **연속 스타일 유지 방법**  
> 첫 번째 이미지 생성 후, 같은 대화창에서 이어서 요청하면 스타일이 더 일관되게 유지됩니다.  
> 예: *"이전과 같은 스타일로 즐겨찾기 화면도 만들어줘"*

> ⚠️ **이미지 비율 지정**  
> 요청 시 "세로 비율로 (9:16)" 또는 "가로 비율로 (16:9)" 를 프롬프트 끝에 추가하세요.

### 권장 후처리 워크플로우

```
1. ChatGPT에서 이미지 생성 → 레이아웃 아이디어 확보
2. Figma에 이미지를 배경 레퍼런스로 import
3. Figma 컴포넌트로 실제 UI 재현 (Auto Layout 활용)
4. 브랜드 컬러 토큰 적용 (아래 참고)
5. Pretendard 폰트로 한글 텍스트 정확하게 입력
6. Figma Prototype 연결 → 인터랙티브 프로토타입 완성
```

---

## 🎨 브랜드 컬러 토큰 (Figma 등록용)

| 이름 | HEX | 용도 |
|---|---|---|
| Ocean Blue | `#0C3B6E` | Primary · CTA · 헤더 |
| Wave Cyan | `#07C0D4` | Accent · 활성 상태 · 포인트 |
| Sea Sand | `#F0EDE5` | 라이트 모드 배경 · 카드 표면 |
| Deep Ocean | `#0D1B2A` | 다크 모드 배경 |
| Dark Surface | `#1A2E44` | 다크 모드 카드 |
| EXCELLENT | `#10B981` | 등급: 최적 |
| GOOD | `#3B82F6` | 등급: 양호 |
| FAIR | `#F59E0B` | 등급: 주의 |
| POOR | `#EF4444` | 등급: 비추천 |
| Text Primary | `#1E293B` | 본문 텍스트 |
| Text Secondary | `#64748B` | 캡션 · 레이블 |
| Border | `#E2E8F0` | 구분선 · 아웃라인 |

---

## 📱 앱 화면 — 온보딩 · 인증

---

### APP-01 · 스플래시 화면

**화면 목적:** 앱 로딩 중 표시되는 브랜드 화면

```
Create a high-fidelity mobile app splash screen for a Korean water sports weather app called "WAVESPOT".

Design:
- Deep ocean blue gradient background, from #0C3B6E at top to #051A3A at bottom
- Centered large abstract wave logo icon in Wave Cyan (#07C0D4), clean geometric style
- App name "WAVESPOT" in bold white sans-serif font below the icon, wide letter spacing
- Subtle circular ripple rings around the logo in semi-transparent cyan, suggesting water
- No people, no photographs, no additional text

Style: Ultra-clean minimal UI design, professional, trustworthy Korean app aesthetic.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-02 · 온보딩 — 종목 선택

**화면 목적:** 관심 수상 스포츠 종목 선택 (온보딩 2/3 단계)

```
Create a high-fidelity mobile app onboarding screen for "WAVESPOT", a Korean water sports weather app.
This is step 2 of 3: sport selection.

Layout from top to bottom:
- Progress indicator: 3 dots at top, step 2 highlighted in Ocean Blue (#0C3B6E)
- Title text area: large question in Korean placeholder style
- 2x3 grid of sport selection cards (6 total): Surfing, Yacht/Sailing, Marina, Water Skiing, Kayak/SUP, Scuba Diving
- Each card: minimal line icon + sport name label, rounded rectangle shape
- 2 cards shown as SELECTED: cyan (#07C0D4) border + light cyan tint background + checkmark
- 4 cards UNSELECTED: white background + light gray border
- "다음" (Next) CTA button at bottom, solid Ocean Blue (#0C3B6E), full-width rounded

Colors: Sea Sand (#F0EDE5) background, Ocean Blue primary, Wave Cyan accent.
Style: Clean minimal Korean app design, sans-serif typography.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-03 · 온보딩 — 숙련도 선택

**화면 목적:** Simple / Expert 뷰 기본값을 결정하는 숙련도 선택 (온보딩 3/3 단계)

```
Create a high-fidelity mobile app onboarding screen for "WAVESPOT", a Korean water sports weather app.
This is step 3 of 3: experience level selection.

Layout from top to bottom:
- Progress indicator: 3 dots, step 3 active in Ocean Blue (#0C3B6E)
- Title text area: "How experienced are you?" style heading
- 3 large stacked selection cards (full-width, tall rounded rectangles):
  Card 1 — Beginner (입문자): wave/smile icon, subtitle "Show me simple results — can I go today?"
  Card 2 — Intermediate (중급자): bar chart icon, subtitle "Show me key numbers and charts."
  Card 3 — Expert (고급자): compass/target icon, subtitle "Show me all data including weather models."
- Card 1 shown as SELECTED: Ocean Blue (#0C3B6E) fill, white text and icon
- Cards 2-3 UNSELECTED: white background, dark text, light gray border
- "시작하기" (Start) CTA button at bottom, Ocean Blue, full-width

Colors: Sea Sand (#F0EDE5) background.
Style: Clean minimal Korean app design.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

## 📱 앱 화면 — 메인 지도

---

### APP-04 · 메인 지도 (라이트 모드)

**화면 목적:** 앱 메인 화면. 네이버 지도 위 활동 등급 마커 표시

```
Create a high-fidelity mobile app main screen for "WAVESPOT", a Korean water sports weather app.

Screen elements from top to bottom:
- Status bar at very top
- Search bar with placeholder text and filter chips below it (rounded pill chips: "종목", "지역", "거리순")
- Main area: a clean minimal map of South Korea's east coastline (Gangwon province coast area), pastel-toned, Naver Maps style
- On the map, 9 circular spot markers scattered along the coastline:
  * 3 markers: solid green circle (EXCELLENT condition)
  * 3 markers: solid blue circle (GOOD condition)
  * 2 markers: solid yellow circle (FAIR condition)
  * 1 marker: solid red circle (POOR condition)
  * Each marker has a tiny white wave icon inside
- Partially visible bottom sheet card peeking from bottom edge (spot preview card)
- Bottom tab bar: 4 icons (Map active in Ocean Blue, Favorites, Community, My Page)

Colors: Sea Sand (#F0EDE5) UI chrome, Ocean Blue (#0C3B6E) active elements, Wave Cyan (#07C0D4) accent.
Style: Clean minimal Korean app design.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-05 · 메인 지도 (다크 모드 + 풍향 레이어)

**화면 목적:** 다크 모드 + 풍향 화살표 오버레이 (Pro 기능)

```
Create a high-fidelity mobile app main map screen for "WAVESPOT" in DARK MODE with wind layer overlay.

Screen elements:
- Dark ocean-themed map background (#0D1B2A), showing simplified South Korea east coastline
- Spot markers glowing softly in their condition colors (green/blue/yellow/red) against the dark map
- Wind direction overlay: 15-20 small cyan (#07C0D4) arrow icons scattered across the map, all pointing roughly southeast direction, varying sizes based on wind speed magnitude
- Subtle glow/blur effect on the cyan arrows suggesting real-time animation
- Top: frosted glass search bar (dark semi-transparent)
- Bottom-left: layer toggle button with "PRO" badge label
- Bottom tab bar: dark theme, 4 icons

Colors: Deep Ocean (#0D1B2A) background, Dark Surface (#1A2E44) cards, Wave Cyan (#07C0D4) arrows and accents.
Style: Dark mode minimal Korean app design, glowing elements.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

## 📱 앱 화면 — 스팟 카드 · 스팟 상세

---

### APP-06 · 바텀시트 스팟 카드 (L2) — Simple View

**화면 목적:** 지도 마커 탭 시 올라오는 반화면 컨디션 요약 카드 (입문자용)

```
Create a high-fidelity mobile app screen for "WAVESPOT" showing a bottom sheet modal card (half-screen) over the map.

The bottom sheet card contains:
- Drag handle at the very top center
- Spot name bold heading + small region tag chip "강원 동해"
- SIMPLE VIEW content:
  * Large centered activity grade display: big rounded rectangle in green (#10B981) with "EXCELLENT" text in white, and a wave emoji icon
  * One-line natural language summary text (placeholder Korean text area)
  * Small warning note: "⚠️ 낙뢰 주의" in amber color
- Today's hourly forecast bar: 8 small colored block pills in a row (green, green, blue, blue, yellow, blue, green, green) with hour labels below
- Two icon buttons top-right of card: Bell icon (알림) + Star icon (즐겨찾기)
- Text link at bottom: "상세 보기 →" in Ocean Blue

Map visible in background (dimmed), white card with rounded top corners.
Colors: White card, Sea Sand background, Ocean Blue (#0C3B6E) primary, green EXCELLENT grade.
Style: Clean minimal Korean app design.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-07 · 스팟 상세 — Expert View (Pro)

**화면 목적:** 수치 전체 + 그래프를 보여주는 고급자용 Expert 뷰

```
Create a high-fidelity mobile app spot detail screen for "WAVESPOT", showing EXPERT VIEW for Pro users.

Screen layout from top to bottom:
- Hero image area: coastal beach scene illustration (no real photo) with gradient overlay, spot name text overlay, difficulty badge chip
- Tab bar below hero: 5 tabs [정보] [예보] [조석] [커뮤니티] [리뷰] — "예보" tab active, underlined in Ocean Blue
- Top-right: toggle switch labeled "Simple | Expert" — Expert side highlighted in Wave Cyan (#07C0D4)
- Activity score section: "82 / 100 GOOD" in blue (#3B82F6), with 3 horizontal bar indicators below:
  * 파고 (Waves): filled bar ~80%
  * 풍속 (Wind): filled bar ~65%  
  * 파주기: filled bar ~95%
- Data grid 2 columns x 3 rows: Wind Speed / Wave Height / Wave Period / Swell / Sea Temp / Current — each with icon + value + unit
- Line chart area: 24-hour wave height forecast, cyan (#07C0D4) smooth curve line
- Observation data row: station name + distance + "실측 vs 예보" two values side by side

Colors: Sea Sand (#F0EDE5) background, Ocean Blue primary, Wave Cyan accent, blue for GOOD grade.
Style: Clean minimal Korean app design, data-rich but organized.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-08 · 스팟 상세 — 정보 탭 (예약·연락처)

**화면 목적:** 스팟 기본 정보 + 예약 및 연락처 섹션

```
Create a high-fidelity mobile app spot detail screen for "WAVESPOT", showing the INFO tab with booking and contact details.

Screen layout from top to bottom:
- Hero image area: surf school at beach illustration, spot name overlay, back button
- Tab bar: [정보 active] [예보] [조석] [커뮤니티] [리뷰]
- Scrollable content sections:
  1. Spot basics row: difficulty chip (beginner), average depth "2.1m", bottom type "모래(sand)"
  2. Amenities row: 4 icon + label pairs: Parking ✓, Shower ✓, Rental Shop ✓, Lifeguard ✓
  3. Operating hours row: clock icon + "09:00 ~ 18:00" text
  4. Price info row: price tag icon + "서핑 강습 1인 ₩60,000~" in highlighted badge
  5. Booking section (clearly separated card):
     - "예약 정보" section title
     - Two buttons: outlined "홈페이지 방문" + solid Ocean Blue "예약하기 →" with calendar icon
     - "사전 예약 필수" red badge chip
  6. Contact row: phone icon + number, Instagram icon, KakaoTalk icon — all tappable
  7. Horizontal scroll strip: 3 small photo placeholder cards (tap to view gallery)

Colors: Sea Sand (#F0EDE5) background, Ocean Blue (#0C3B6E) CTA buttons, Wave Cyan (#07C0D4) accents.
Style: Clean minimal Korean app design, list-based layout.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-09 · 스팟 상세 — marina 타입 (marina_info 조건부 표시)

**화면 목적:** spot_types에 'marina'가 포함된 스팟의 SpotDetailScreen. 별도 화면이 아니라 동일한 스팟 상세 화면에서 marina_info 섹션이 조건부로 표시됨

```
Create a high-fidelity mobile app SPOT DETAIL screen for "WAVESPOT" showing a marina-type spot.
This is the SAME SpotDetailScreen used for all spot types — marina_info section is conditionally shown.

Screen layout from top to bottom:
- Hero image area: illustrated marina with sailboats docked, gradient overlay, spot name overlay
- Marina type badge: anchor icon + "마리나" chip in Ocean Blue (conditional — shown only when spot_types includes 'marina')
- Tab bar: [정보 active] [예보] [조석] [커뮤니티] [리뷰]
- Scrollable INFO tab content:
  1. Marina stats row (4 icon+value chips): "선석 120개" / "최대 35m" / "흘수 3.5m" / fuel pump icon ✓
     (This entire row is conditional — only visible for marina type spots)
  2. Yacht rental highlight card (elevated card with yacht icon):
     - "요트 대여 가능" bold heading
     - Operator name placeholder, "₩150,000~/일" price
     - "세일링 스쿨 운영 중" green badge
  3. Entry info row: "입항 수수료 있음" info chip, operating hours "08:00~18:00"
  4. Booking section:
     - Two buttons: outlined "홈페이지 방문" + solid Ocean Blue "예약하기 →"
  5. Contact row: phone icon, Instagram icon, KakaoTalk icon
  6. Horizontal swipe info cards: marina aerial view illustration / dock facility / route map
  7. Current condition mini card at bottom: wind + wave status for sailing

Colors: Sea Sand (#F0EDE5) background, Ocean Blue (#0C3B6E) primary, Wave Cyan (#07C0D4) accent.
Style: Clean minimal Korean app design.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

## 📱 앱 화면 — 예보 · 조석 · 관측소

---

### APP-10 · 7일 예보 상세 그래프 (Pro)

**화면 목적:** 시간별 파고·풍속 통합 타임라인 그래프

```
Create a high-fidelity mobile app forecast detail screen for "WAVESPOT", a Pro feature.

Screen layout from top to bottom:
- Header: spot name + "7일 예보" title, model selector toggle "GFS | ECMWF" on right
- Activity grade color band: 7 colored blocks in a row (green/green/blue/yellow/blue/green/green) representing each day
- Main chart area (takes up ~40% of screen):
  * X-axis: time labels (6-hour intervals for 7 days, scrollable horizontally)
  * Primary line: Wave Height — smooth cyan (#07C0D4) curve, 0.5m to 2.5m range with shaded area below
  * Secondary bars: Wind Speed — light blue translucent bars behind the line
  * Y-axis labels on left side
  * Vertical drag line: cyan hairline with circular thumb, currently at a specific time
- Selected time detail card below chart: all metric values for the selected moment
- Calendar view / Table view toggle buttons

Colors: Sea Sand (#F0EDE5) background, Wave Cyan (#07C0D4) chart line, Ocean Blue (#0C3B6E) headers.
Style: Data visualization focused, clean minimal Korean app design.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-11 · 조석표

**화면 목적:** 당일 + 3일 고저조 시각 및 조위 그래프

```
Create a high-fidelity mobile app tidal information screen "조석표" for "WAVESPOT".

Screen layout from top to bottom:
- Header: today's date + spot name
- Large tidal curve chart (main visual, takes ~35% of screen height):
  * Smooth sinusoidal wave curve in Ocean Blue (#0C3B6E)
  * X-axis: 24 hours (00:00 to 24:00)
  * Y-axis: tidal height in cm
  * 2 high tide peaks marked with upward triangle + time label
  * 2 low tide troughs marked with downward triangle + time label
  * Current time: glowing Wave Cyan (#07C0D4) vertical line with "현재" label
  * Light blue shaded fill below the curve
- 4 tidal event cards in 2x2 grid below chart:
  Each card: time (e.g., "06:24"), type label "고조" or "저조", height in cm, arrow icon
  High tide cards: Ocean Blue tint. Low tide cards: light gray tint.
- "3일 예보" section: horizontal scroll with 3 small mini tidal charts for next 3 days

Colors: Sea Sand (#F0EDE5) background, Ocean Blue (#0C3B6E) chart, Wave Cyan (#07C0D4) current marker.
Style: Clean minimal Korean app design.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-12 · 관측소 실시간 데이터 비교 (Pro)

**화면 목적:** 예보값 vs 관측소 실측값 나란히 비교

```
Create a high-fidelity mobile app screen for "WAVESPOT" showing real-time weather station data vs forecast comparison. This is a Pro-only feature.

Screen layout from top to bottom:
- Header: "관측소 실시간 데이터" title, PRO badge chip (Ocean Blue) on right
- Primary station card (elevated):
  * Station icon (tower icon) + station name + "8.2km 거리" + last updated time
  * Station type chip: "기상청 AWS"
- Comparison table, 5 rows, 3 columns:
  Column headers: [항목] [예보] [실측]
  Row 1 — 풍속: 5.2 m/s | 4.8 m/s (실측 in green text — better)
  Row 2 — 풍향: SSW 210° | SSW 205° (neutral gray)
  Row 3 — 기온: 22°C | 21.5°C (neutral)
  Row 4 — 파고: 1.4m | — (N/A dash, no wave data for this station)
  Row 5 — 수온: 18°C | 17.8°C
  Alternating row backgrounds. Green color = actual is favorable vs forecast.
- Divider
- Secondary station card:
  * Buoy icon + "국립해양조사원 부이 B-08" + "22km" distance
  * Shows wave height actual data only

Colors: Sea Sand (#F0EDE5) background, Ocean Blue (#0C3B6E) headers, green (#10B981) for favorable actual readings.
Style: Clean minimal Korean app design, data table layout.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

## 📱 앱 화면 — 즐겨찾기 · 알림 · 홈 위젯

---

### APP-13 · 즐겨찾기 목록

**화면 목적:** 저장된 스팟 카드 리스트 + 오늘 최적 시간대

```
Create a high-fidelity mobile app favorites list screen for "WAVESPOT".

Screen layout from top to bottom:
- Header: "즐겨찾기" title, sort option button on right
- 3 stacked spot summary cards (full-width, rounded rectangles):

  Card 1 (EXCELLENT — green):
  - Left color bar: solid green (#10B981) strip
  - Spot name bold, region + sport type tags below
  - Right: wind speed + wave height quick stats
  - Below: 8-slot hourly color bar
  - Green highlighted text: "Best: 오후 2시~4시"

  Card 2 (GOOD — blue):
  - Left color bar: solid blue (#3B82F6) strip
  - Marina spot: anchor icon + "마리나" tag
  - Right: wind speed stats
  - Blue highlighted text: "요트 출항 가능"

  Card 3 (FAIR — yellow):
  - Left color bar: solid yellow (#F59E0B) strip
  - Inland spot: lake icon + "수상스키" tag
  - Yellow warning text: "오후 이후 주의"

- Bottom tab bar: 4 icons, Favorites tab active

Colors: Sea Sand (#F0EDE5) background, grade colors for left bars, Ocean Blue active tab.
Style: Clean minimal Korean app design, card list layout.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-14 · 알림 설정 빌더 (Pro)

**화면 목적:** 종목별 조건 조합 알림 설정 UI

```
Create a high-fidelity mobile app notification settings screen for "WAVESPOT". This is a Pro feature called "알림 설정".

Screen layout from top to bottom:
- Header: back button + "알림 설정" title + spot name subtitle
- PRO badge chip visible

Section 1 — Sport selector:
- Horizontal chips: [서핑 ✓ selected in Ocean Blue] [요트] [카약] [마리나]

Section 2 — Grade trigger:
- Label "이 등급 이상이면 알림"
- Segmented control: [EXCELLENT만] [GOOD 이상 ✓ selected] [FAIR 이상]

Section 3 — Custom conditions (accordion, collapsed):
- Row label: "직접 조건 설정" + PRO badge + expand arrow
- When expanded: Wave height dual slider "0.5m ─●──────●─ 2.5m" + Wind speed slider

Section 4 — Quiet hours:
- Toggle "방해 금지 시간" — ON state
- Time range display: "22:00 ~ 07:00"

Section 5 — Save:
- Full-width solid Ocean Blue button: "알림 저장"
- Below: "현재 2개 스팟 알림 활성 중" status text

Colors: Sea Sand (#F0EDE5) background, Ocean Blue (#0C3B6E) primary, Wave Cyan (#07C0D4) active sliders.
Style: Clean minimal Korean app design, form/settings layout.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-15 · iOS 홈 스크린 위젯 (Pro)

**화면 목적:** iOS 홈 화면에 배치되는 즐겨찾기 스팟 위젯

```
Create a realistic iPhone 15 Pro home screen mockup for "WAVESPOT" showing iOS home screen widgets.

Home screen setup:
- Blurred app icons in background (realistic iOS home screen layout)
- WAVESPOT MEDIUM widget (2 columns wide, 2 rows tall, top center):
  * Background: ocean gradient from Ocean Blue (#0C3B6E) to Wave Cyan (#07C0D4)
  * Top-left: tiny WAVESPOT wave logo + "WAVESPOT" small label
  * Center large: "EXCELLENT" text in white, green glow effect, surfboard icon
  * Bottom row: wave icon + "1.4m" + wind icon + "5.2m/s" + clock icon + "Best 14:00~16:00"
  * Rounded corners, depth shadow

- WAVESPOT SMALL widget (1 column, 1 row, beside medium widget):
  * Background: dark ocean gradient (#0D1B2A to #1A2E44)
  * Anchor icon + "전곡항 마리나" small text
  * "GOOD" in blue, centered
  * "💨 12kt" wind info

Both widgets: realistic iOS widget style with rounded corners, glass-like depth, system font.
Format: iPhone 15 Pro home screen, 9:16 ratio, realistic perspective.
Output: Photo-realistic iPhone mockup with flat UI widgets, not a drawn illustration.
```

---

## 📱 앱 화면 — 커뮤니티 · 구독

---

### APP-16 · 커뮤니티 리포트 피드

**화면 목적:** 현장 리포트 타임라인

```
Create a high-fidelity mobile app community reports feed screen for "WAVESPOT".

Screen layout from top to bottom:
- Sticky header: spot name + current condition grade color banner
- Scrollable feed of 3 report cards:

  Card 1 (most recent):
  - User avatar circle + username "@surfer_kim" + "2시간 전" timestamp
  - Photo placeholder rectangle (beach/wave scene area, illustrated not real photo)
  - Report text area (Korean placeholder text about wave conditions)
  - Bottom row: EXCELLENT badge + 5 stars + thumbs up icon + comment count

  Card 2 (no photo):
  - User avatar + "@yachter_park" + "5시간 전"
  - Text-only report about marina depth warning
  - FAIR badge + 3 stars

  Card 3:
  - User avatar + "@paddler_lee" + "1일 전"
  - 2 photo thumbnails side by side
  - Short text

- Floating action button (FAB) bottom right: "+" in Wave Cyan circle (Pro users only)
- Bottom tab bar: Community tab active

Colors: Sea Sand (#F0EDE5) background, white cards, Ocean Blue (#0C3B6E) primary.
Style: Clean minimal Korean app design, social feed layout.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### APP-17 · 구독 플랜 비교 화면

**화면 목적:** Free vs Pro 구독 선택 화면

```
Create a high-fidelity mobile app subscription plan comparison screen for "WAVESPOT".

Screen layout from top to bottom:
- Header: "구독 플랜" title
- Monthly/Annual toggle switch at top: [월간] [연간 25% 할인 ✓ selected]

FREE plan card (standard, top):
- "Free" label, "₩0" price
- Feature list with checkmarks: map browsing, current conditions, 3-day forecast, dark mode, unit settings
- Grayed out locked features: 7-day forecast, Expert View, alerts, home widget (shown with lock icons)
- Gray border, standard size

PRO plan card (emphasized, larger, bottom):
- Glowing Ocean Blue border, subtle gradient background
- Crown icon + "PRO" label in gradient text
- Price: "₩34,900/년" large + "월 ₩2,908" small below
- Full feature list — Free features PLUS Wave Cyan checkmarks for premium:
  "7일 상세 예보" / "Expert View" / "관측소 실시간" / "홈 위젯" / "알림 무제한"
- "7일 무료 체험 후 구독" CTA button — solid Ocean Blue, full-width, rounded
- Apple/Google payment icons small below button

Colors: Sea Sand (#F0EDE5) background, Ocean Blue (#0C3B6E) Pro card accent, Wave Cyan (#07C0D4) feature checkmarks.
Style: Clean minimal Korean app design, pricing comparison layout.
Format: iPhone 15 Pro vertical screen mockup, 9:16 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

## 🖥️ 관리자 웹 화면

> 웹 화면은 **가로 비율 (16:9)** 로 요청하세요.  
> 요청 시 "가로 비율 16:9 데스크탑 브라우저 화면으로 만들어줘" 추가.

---

### WEB-01 · 관리자 대시보드 홈

**화면 목적:** MAU·구독자·스팟 수 요약 + 기상 수집 현황

```
Create a high-fidelity admin web dashboard homepage for "WAVESPOT" app management, desktop browser layout.

Layout:
- Left sidebar (narrow, ~15% width): WAVESPOT logo at top, navigation menu items listed vertically: 대시보드 (active), 스팟 관리, 스팟 요청, 기상 모니터링, 유저 관리, 구독 현황. Sidebar background: Ocean Blue (#0C3B6E), white text/icons.

- Main content area (white background):
  Top row — 4 KPI stat cards:
    * MAU: "1,247" large number, "+12%" green badge, person icon
    * Pro 구독자: "89명" + "₩347,100 MRR", crown icon in gold
    * 등록 스팟: "47개" + "+3 this month", map pin icon
    * API 호출: "12,430 / 50,000" with small donut gauge

  Middle row — 2 panels side by side:
    Left panel (60%): Line chart "월별 MAU 추이" — 6-month trend, Ocean Blue line on white, x-axis months, y-axis user count
    Right panel (40%): Table "최근 스팟 요청" — 5 rows with columns: 스팟명, 요청자, 상태 badges (pending=yellow chip, approved=green chip)

  Bottom row: "기상 수집 상태" — horizontal list of API sources with last collection timestamp and green/red status dots

Colors: Ocean Blue (#0C3B6E) sidebar, white main area, Sea Sand (#F0EDE5) card backgrounds.
Style: Clean professional admin dashboard, sans-serif.
Format: Desktop browser mockup, 16:9 ratio, MacBook Pro style browser frame.
Output: Flat UI design illustration, not a photograph.
```

---

### WEB-02 · 스팟 관리 화면

**화면 목적:** 스팟 목록 관리 + 스팟 등록/수정 폼

```
Create a high-fidelity admin web spot management page for "WAVESPOT", desktop browser layout.

Layout:
- Same Ocean Blue (#0C3B6E) left sidebar navigation as dashboard
- Main content area:

  Top toolbar:
  - "스팟 관리" page title (left)
  - Right side: search bar + filter dropdowns (지역, 종목, 활성화여부) + "새 스팟 등록 +" button in Ocean Blue

  Data table (main area, ~60% width):
  - Column headers: 스팟명 / 지역 / 종목 / 난이도 / 수심 / 활성화 / 수정일 / 액션
  - 4 data rows with alternating white/light gray backgrounds
  - One row EXPANDED with inline edit form showing input fields:
    * 스팟명, 주소 text inputs
    * 홈페이지 URL, 예약 URL, 전화번호 input fields (newly added in v1.3)
    * 운영시간, 요금정보 text areas
    * spot_type checkboxes including "마리나" option
    * When "마리나" is checked: expanded marina_info section with sub-fields
    * "저장" and "취소" buttons

  Right side panel (~35% width):
  - Mini Naver-style map showing selected spot location as a pin
  - Spot cover image preview area

Colors: Ocean Blue sidebar, white content area, Sea Sand table row alternating.
Style: Professional admin UI, data table + inline edit pattern.
Format: Desktop browser mockup, 16:9 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

### WEB-03 · 스팟 추가 요청 검토 화면

**화면 목적:** 유저가 요청한 스팟 승인 / 반려 처리

```
Create a high-fidelity admin web spot request review page for "WAVESPOT", desktop browser layout.

Layout:
- Same Ocean Blue (#0C3B6E) left sidebar, "스팟 요청" menu item active
- Main content split into two panels:

  LEFT PANEL (55% width) — Request list table:
  - Column headers: 요청 스팟명 / 요청자 / 제출시각 / 상태
  - 5 rows:
    * Row 1 (selected/highlighted in light blue): status chip "검토중" yellow
    * Row 2: status chip "승인완료" green
    * Row 3: status chip "반려" red
    * Rows 4-5: status chip "대기중" gray
  - Pagination at bottom

  RIGHT PANEL (45% width) — Selected request detail:
  - Section header: "요청 상세 / Request Detail"
  - Requested spot name + sport type chips
  - User description text block
  - Photo gallery: 3 user-submitted photo placeholder thumbnails in a row
  - Mini map showing requested pin location
  - Admin verification checklist:
    * ☑ 금지구역 확인
    * ☑ 사업장 등록 확인
    * ☐ 위성사진 확인
  - Admin data entry form (to fill before approving):
    * 난이도 select, 수심 number input, 편의시설 checkboxes
  - Two action buttons at bottom:
    * "승인 및 공개" — solid Ocean Blue, full width
    * "반려" — red outlined button
    * Rejection reason textarea (shown below rejection button)

Colors: Ocean Blue sidebar, white panels, yellow/green/red status chips.
Style: Professional admin UI, review workflow pattern.
Format: Desktop browser mockup, 16:9 ratio.
Output: Flat UI design illustration, not a photograph.
```

---

## 💡 추가 팁 — 더 좋은 결과를 위해

### 연속 생성 시 스타일 유지
```
# 첫 이미지 생성 후, 이렇게 이어서 요청하세요:

"방금 만든 WAVESPOT 앱 디자인 스타일과 동일하게,
즐겨찾기 화면(APP-13)을 만들어줘.
같은 컬러 (#0C3B6E, #07C0D4, #F0EDE5), 같은 UI 스타일 유지."
```

### 세부 수정 요청
```
# 특정 부분만 바꾸고 싶을 때:

"이전 이미지에서 활동 등급을 EXCELLENT(초록)에서
POOR(빨강)로 바꾸고, 경고 배너 '⚠️ 기상특보 발령 중'을
상단에 추가해줘."
```

### 다크 모드 변환
```
# 라이트 모드 화면을 다크 모드로 변환할 때:

"이전 WAVESPOT 앱 화면을 다크 모드로 변환해줘.
배경을 #0D1B2A (Deep Ocean), 카드를 #1A2E44 (Dark Surface),
텍스트를 흰색으로 바꾸고, Wave Cyan (#07C0D4) 포인트는 유지해줘."
```

---

*WAVESPOT Prototype Prompt Guide v1.0 — 2026*
