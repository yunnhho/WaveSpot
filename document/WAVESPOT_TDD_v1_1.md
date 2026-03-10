**🌊 WAVESPOT**

한국 해양·수상 스포츠 컨디션 앱

**기술 설계 문서 (TDD)**

Technical Design Document --- Version 1.1

2026년 작성 \| 대응 SRS: v1.3

Web (Admin) · iOS · Android \| Flutter + NestJS + PostgreSQL

**Brand Colors**

**■ Ocean Blue #0C3B6E ■ Wave Cyan #07C0D4 ■ Sea Sand #F0EDE5**

**1. 브랜드 컬러 및 디자인 토큰**

**1.1 대표 컨셉 컬러 (3가지)**

WAVESPOT의 컬러 시스템은 \'깊은 바다의 신뢰감\'과 \'파도의 에너지\'를
조합하여 설계했습니다. 수상 스포츠 앱은 야외·강한 햇빛·다크 환경
모두에서 가독성이 보장되어야 합니다.

  ----------------------------------------------------------------------------
  **컬러명**    **HEX**   **역할**      **사용 위치**      **선정 근거**
  ------------- --------- ------------- ------------------ -------------------
  Ocean Blue    #0C3B6E   Primary /     상단 헤더, 주요    깊은 바다색.
                          Brand         CTA 버튼, 섹션     신뢰·전문성·안전.
                                        타이틀, 네이버     태양광 아래에서도
                                        지도 마커 테두리   충분한 대비.

  Wave Cyan     #07C0D4   Accent /      활성 탭,           파도·물결의 역동성.
                          Active        하이라이트,        에너지와 활동감.
                                        EXCELLENT 등급     다크 배경에서 특히
                                        포인트, 로딩       가시성 우수.
                                        인디케이터         

  Sea Sand      #F0EDE5   Surface /     라이트 모드 배경,  모래사장·백사장.
                          Background    카드 표면, 비활성  화이트보다 눈의
                                        영역               피로 감소. 햇빛
                                                           아래 야외 사용
                                                           최적화.
  ----------------------------------------------------------------------------

**1.2 전체 컬러 팔레트 (확장)**

  -------------------------------------------------------------------------
  **용도**       **Light Mode**     **Dark Mode**      **설명**
  -------------- ------------------ ------------------ --------------------
  Background     #F0EDE5 (Sea Sand) #0D1B2A (Deep      앱 전체 배경
                                    Ocean)             

  Surface (카드) #FFFFFF            #1A2E44            카드·바텀시트·모달
                                                       배경

  Primary        #0C3B6E (Ocean     #3B82F6 (밝은      주요 버튼·링크
                 Blue)              파랑)              

  Accent         #07C0D4 (Wave      #07C0D4            하이라이트·포인트
                 Cyan)                                 

  Text Primary   #1E293B            #F1F5F9            본문 텍스트

  Text Secondary #64748B            #94A3B8            부연 설명·레이블

  EXCELLENT      #10B981 (에메랄드) #10B981            최적 등급

  GOOD           #3B82F6 (파랑)     #60A5FA            활동 가능

  FAIR           #F59E0B (앰버)     #FBBF24            주의 필요

  POOR           #EF4444 (빨강)     #F87171            활동 비추천

  Border         #E2E8F0            #1E3A5F            구분선

  Overlay Dim    rgba(0,0,0,0.4)    rgba(0,0,0,0.6)    바텀시트 딤 처리
  -------------------------------------------------------------------------

**1.3 타이포그래피 토큰**

  ------------------------------------------------------------------------
  **토큰명**         **크기**    **굵기**    **용도**
  ------------------ ----------- ----------- -----------------------------
  display            28sp        Bold        스팟명 대형 타이틀

  headline           22sp        SemiBold    섹션 헤더, 카드 제목

  title              18sp        Medium      탭 레이블, 리스트 항목 제목

  body               16sp        Regular     본문 텍스트, 설명

  label              14sp        Medium      배지, 태그, 단위 레이블

  caption            12sp        Regular     타임스탬프, 보조 설명

  score              48sp        ExtraBold   활동 지수 숫자 (Simple View)
  ------------------------------------------------------------------------

**1.4 아이콘 & 마커 규칙**

-   스팟 마커: 원형 배경 + 스포츠 종목 아이콘. 색상은 활동 등급에 따라
    변경.

-   풍향 화살표: Wave Cyan (#07C0D4) 색상, 두께 2px, 길이는 풍속에 비례.

-   기상특보 배너: POOR 빨강 배경 + 흰색 텍스트 \'⚠️ 기상특보 발령 중\'.

-   관측소 마커 (지도): 육각형 아이콘으로 스팟 마커와 구분.

**2. 시스템 아키텍처**

**2.1 전체 구성도 (컴포넌트)**

WAVESPOT은 크게 4개 레이어로 구성됩니다: 클라이언트(앱·웹), API Gateway,
백엔드 서비스, 데이터 레이어.

  ------------------------------------------------------------------------
  **레이어**    **컴포넌트**         **역할**
  ------------- -------------------- -------------------------------------
  Client        Flutter App          사용자 앱. 네이버 지도, Simple/Expert
                (iOS·Android)        뷰, 위젯

  Client        Admin Web (Next.js)  관리자 대시보드. 스팟 CRUD, 스팟 요청
                                     검토

  API Gateway   AWS ALB + Nginx      SSL 종료, 요청 라우팅, Rate Limiting

  Backend       NestJS API Server    REST API. 인증, 스팟, 기상, 구독,
                                     알림 모듈

  Backend       Weather Worker       기상·관측소 데이터 수집 파이프라인
                (Node.js Cron)       

  Backend       Score Engine         스팟×종목별 활동 지수 사전 계산
                (Node.js)            

  Backend       Notification Worker  FCM 알림 조건 평가 및 발송

  Backend       Tile Renderer (Phase 기상 그리드 → PNG 타일 렌더링 서버
                2)                   

  Data          PostgreSQL + PostGIS 스팟, 기상 스냅샷, 사용자, 구독 등
                                     영구 저장

  Data          Redis                기상 캐시, 세션, 알림 큐, 타일 캐시

  Data          Cloudflare R2        스팟 이미지, 커뮤니티 사진, 기상 타일
                                     PNG

  External      기상청 API,          기상·해양 예보 및 실측 데이터 소스
                Open-Meteo,          
                국립해양조사원       

  External      FCM                  iOS·Android 푸시 알림

  External      네이버 지도 API      지도 타일, POI, 지오코딩

  External      포트원 v2 +          결제 처리
                Apple/Google IAP     
  ------------------------------------------------------------------------

**2.2 환경 구성**

  ------------------------------------------------------------------------
  **환경**      **용도**        **인프라**
  ------------- --------------- ------------------------------------------
  Development   로컬 개발       Docker Compose (PostgreSQL·Redis·NestJS
                                로컬)

  Staging       QA·테스트       AWS ECS (Fargate) + RDS t3.micro +
                                ElastiCache t3.micro

  Production    실 서비스       AWS ECS (Fargate) + RDS t3.small+ +
                                ElastiCache t3.small
  ------------------------------------------------------------------------

**2.3 백엔드 NestJS 모듈 구조**

  ----------------------------------------------------------------------------
  **모듈**              **담당 기능**          **주요 엔드포인트**
  --------------------- ---------------------- -------------------------------
  AuthModule            JWT 발급, 소셜 OAuth2  POST /auth/kakao, /auth/apple,
                        (카카오·애플·구글),    /auth/google, /auth/refresh
                        Refresh Token          

  UsersModule           회원 CRUD, 숙련도      GET/PATCH /users/me
                        설정, 단위 설정        

  SpotsModule           스팟 목록·상세·마리나, GET /spots, /spots/:id,
                        반경 검색, 필터링      /spots/near?lat&lng&radius

  WeatherModule         현재 컨디션, 예보,     GET /weather/:spotId/current,
                        조석, 관측소 데이터    /forecast, /tides, /observation
                        조회                   

  ScoresModule          활동 지수 조회         GET
                        (종목별, 시간별)       /scores/:spotId?sport=surfing

  AlertsModule          알림 설정 CRUD, 알림   GET/POST/DELETE /alerts
                        이력                   

  FavoritesModule       즐겨찾기               GET/POST/DELETE /favorites
                        추가·삭제·목록         

  CommunityModule       리포트 CRUD, 이미지    GET/POST /reports, GET/POST
                        업로드                 /reviews

  SpotRequestsModule    스팟 추가 요청         POST /spot-requests, GET
                        제출·목록·검토         /spot-requests (admin)

  SubscriptionsModule   구독 상태 조회, 웹훅   GET /subscriptions/me, POST
                        처리                   /subscriptions/webhook

  AdminModule           스팟 CRUD, 요청        Admin API --- 별도 Guard
                        승인/반려 (관리자      
                        전용)                  

  TilesModule (Ph.2)    기상 타일 PNG 제공     GET /tiles/:z/:x/:y.png
  ----------------------------------------------------------------------------

**3. 데이터 플로우 (상세)**

**3.1 기상 데이터 수집 파이프라인**

Weather Worker는 Node.js Cron Job으로 동작하며, 3개의 외부 API를 수집해
PostgreSQL에 저장하고 Redis에 캐싱합니다.

**수집 흐름 단계별**

  ----------------------------------------------------------------------------------
  **단계**         **처리 내용**                      **담당 컴포넌트**
  ---------------- ---------------------------------- ------------------------------
  ① 스팟 목록 로드 is_active=true인 스팟 전체 ID·좌표 Weather Worker → PostgreSQL
                   로드                               

  ② 좌표           반경 10km 내 스팟을 1개 요청으로   Worker 내부 로직
  클러스터링       묶어 API 호출 최소화               

  ③ 기상청 API     클러스터별 동네예보 API 호출       Worker → 기상청
  호출             (풍속·기온·강수·UV)                

  ④ Open-Meteo     파고·파주기·너울·수온 수집         Worker → Open-Meteo
  Marine API       (스팟별)                           

  ⑤ 국립해양조사원 조석예보·조류예보 수집 (스팟별)    Worker → 해양조사원
  API                                                 

  ⑥ Redis 캐싱     스팟ID별 최신 기상 데이터 캐시     Worker → Redis
                   저장 (TTL: 60분)                   

  ⑦ PostgreSQL     weather_snapshots 테이블에 시계열  Worker → PostgreSQL
  저장             데이터 INSERT                      

  ⑧ 활동 지수      수집 완료 이벤트 → Score Engine    Worker → Score Engine
  트리거           호출                               

  ⑨ 기상특보 체크  기상청 특보 API 5분마다 폴링 →     별도 경보 Worker
                   경보 스팟 즉시 POOR 처리           
  ----------------------------------------------------------------------------------

  ------------------------------------------------------------------------------
  **API**              **수집 항목**              **갱신       **비용**
                                                  주기**       
  -------------------- -------------------------- ------------ -----------------
  기상청 동네예보 API  풍속·풍향·기온·강수량·UV   1h           무료

  Open-Meteo Marine    파고·파주기·너울·수온      1\~3h        무료(비상업) /
  API                                                          €19/월(상업)

  국립해양조사원       고저조 시각·조위           6h           무료
  조석예보 API                                                 

  국립해양조사원       조류 속도·방향             6h           무료
  조류예보 API                                                 

  기상청 AWS           실측 풍속·기온·강수        1분 (폴링    무료
  (방재기상관측망)                                10분)        

  국립해양조사원       실측 파고·수온·조류        10\~60분     무료
  해양관측부이                                                 

  기상청 기상특보 API  경보·주의보 코드           5분 폴링     무료
  ------------------------------------------------------------------------------

⚠️ Open-Meteo 상업 라이선스 미구매 시 공개 API(무료)를 사용할 수 있지만
Rate Limit 제한이 있습니다 (10,000건/일). 스팟 수 증가 시 상업
플랜(€19/월) 전환 필요.

**3.2 활동 가능 지수 계산 플로우**

Score Engine은 기상 데이터 수집 완료 이벤트를 받아 모든 스팟×종목 조합의
지수를 사전 계산(Precompute)하고 Redis와 PostgreSQL에 저장합니다.

  -----------------------------------------------------------------------
  **단계**      **처리 내용**
  ------------- ---------------------------------------------------------
  ① 데이터 로드 해당 스팟의 최신 weather_snapshots +
                observation_snapshots Redis에서 로드

  ② 항목별      각 기상 항목(풍속·파고·파주기 등)을 0\~100점으로 정규화.
  정규화        종목별 기준 범위 적용.

  ③ 가중치 적용 종목별 가중치 테이블 기반 가중 평균 계산. 예: 서핑은
                파고·파주기 가중치 높음.

  ④ 안전 패널티 단일 항목이 POOR 임계값 초과 시 전체 점수 강제 0점 처리
                (안전 우선 원칙).

  ⑤ 기상특보    weather_alerts 테이블에 해당 스팟 활성 경보 존재 시 최종
  오버라이드    점수 강제 0점.

  ⑥ Redis 저장  score:{spotId}:{sport}:{timestamp} 키로 TTL 70분 캐싱
                (다음 수집 전까지 유효).

  ⑦ PostgreSQL  activity_scores 테이블 INSERT (시계열 보관, 7일 예보용).
  저장          

  ⑧ 알림 트리거 Notification Worker에 이벤트 발행 → 알림 조건 평가 시작.
  -----------------------------------------------------------------------

ℹ️ 클라이언트는 점수를 직접 계산하지 않고 항상 서버 캐시값을 요청합니다.
알고리즘은 서버에서만 관리되므로 앱 업데이트 없이 기준값 조정이
가능합니다.

**3.3 앱 → 서버 데이터 요청 플로우**

앱이 스팟 상세 화면을 로드할 때의 API 요청 흐름입니다.

  -----------------------------------------------------------------------------------------------
  **순서**   **앱 요청**                 **서버 처리**           **응답**
  ---------- --------------------------- ----------------------- --------------------------------
  1          GET /spots/:id              DB에서 스팟 기본 정보   스팟
                                         조회                    명칭·좌표·유형·편의시설·마리나
                                                                 여부

  2          GET /weather/:id/current    Redis 캐시 → 없으면 DB  현재 기상 수치 전체
                                         weather_snapshots       

  3          GET                         Redis 캐시 → 없으면     활동 지수 + 등급 + Simple 자연어
             /scores/:id?sport=surfing   Score Engine 즉시 계산  

  4          GET /weather/:id/forecast   DB activity_scores      시간별 예보 배열
                                         7일치 집계              

  5 (Pro)    GET                         observation_snapshots   관측소 실측값 + 관측소 정보
             /weather/:id/observation    최신 1건                

  6          GET /weather/:id/tides      tides 테이블 오늘+3일치 고저조 시각·조위 배열
  -----------------------------------------------------------------------------------------------

✅ 요청 1\~3은 병렬(Parallel) 처리로 앱에서 동시에 호출해 응답 시간을
최소화합니다. Flutter의 Future.wait() 활용.

**3.4 푸시 알림 플로우**

  -----------------------------------------------------------------------
  **단계**      **처리 내용**
  ------------- ---------------------------------------------------------
  ① 트리거      Score Engine이 지수 계산 완료 후 이벤트 발행 (Redis
                Pub/Sub 또는 BullMQ)

  ② 알림 대상   해당 스팟·해당 등급 조건을 가진 alert_settings 레코드
  조회          조회

  ③ 중복 방지   alert_logs에서 24시간 내 동일 스팟·동일 등급 알림 발송
  체크          이력 확인

  ④ 조용한 시간 사용자별 quiet_start \~ quiet_end 시간대에 해당하면 발송
  체크          보류 (다음 사이클에 재평가)

  ⑤ FCM 발송    Firebase Admin SDK로 개별 디바이스 토큰에 푸시 발송

  ⑥ 발송 로그   alert_logs 테이블에 발송 시각·스팟·등급·수신 여부 기록

  ⑦ 딥링크      알림 탭 시 앱이 해당 스팟 상세 화면으로 직행 (스팟 ID
                포함)
  -----------------------------------------------------------------------

**3.5 날씨 타일 오버레이 플로우 (Phase 2)**

  -----------------------------------------------------------------------
  **단계**      **처리 내용**
  ------------- ---------------------------------------------------------
  ① 기상 그리드 Open-Meteo Ensemble API에서 한국 영역 (33\~38°N,
  수집          124\~130°E) 0.1° 그리드 데이터 수집

  ② PNG 타일    Python + Matplotlib / Node Canvas로 풍향 벡터 PNG 타일
  렌더링        생성 (256×256px, z=5\~10)

  ③ Cloudflare  타일 파일을 R2에 저장. 경로:
  R2 업로드     /tiles/{datetime}/{z}/{x}/{y}.png

  ④ Redis TTL   최신 타일 datetime을 Redis에 저장. 앱이 polling으로 최신
  관리          datetime 확인.

  ⑤ 앱          Flutter 네이버 지도 TileOverlay API에 타일 URL 패턴 등록.
  TileOverlay   시간대 변경 시 URL 교체로 애니메이션.

  ⑥ 캐시 무효화 새 타일 생성 시 이전 타일 R2에서 삭제 (최근 24h분만
                보관).
  -----------------------------------------------------------------------

⚠️ 타일 렌더링 서버는 CPU 집약적 작업입니다. Phase 2에서 별도 ECS Task로
분리하고, 렌더링 완료까지 앱에 정적 화살표 마커를 fallback으로
표시합니다.

**3.6 스팟 요청 처리 플로우**

  ----------------------------------------------------------------------------
  **단계**   **액터**      **처리 내용**
  ---------- ------------- ---------------------------------------------------
  ① 요청     Pro 유저 앱   위치 핀(위경도), 스팟명, 종목, 설명, 사진 최대 3장
  제출                     → POST /spot-requests

  ② 사진     서버          사진을 R2에 저장 → URL 배열을
  업로드                   spot_requests.image_urls에 저장

  ③ 중복     서버 자동     PostGIS ST_DWithin으로 반경 500m 내 기존 스팟 검사.
  검사                     중복이면 status=duplicate로 즉시 반환.

  ④ 알림     FCM → 유저    \'요청이 접수되었습니다. 검토 후 알려드릴게요.\'
  (제출                    
  완료)                    

  ⑤ 관리자   관리자 웹     Admin 대시보드에서 요청 목록 확인. 지도·공공데이터
  검토                     교차 확인 후 승인/반려 처리.

  ⑥ 스팟     서버          승인 시 spots 테이블에 신규 스팟 INSERT.
  생성                     spot_requests.linked_spot_id 업데이트.

  ⑦ 알림     FCM → 유저    승인: \'\[스팟명\] 스팟이 추가되었습니다 🎉\' /
  (결과)                   반려: 사유 포함 메시지
  ----------------------------------------------------------------------------

**4. 백엔드 상세 설계**

**4.1 프로젝트 디렉토리 구조**

wavespot-api/

├── src/

│ ├── auth/ \# JWT, OAuth2 전략, Guard

│ ├── users/ \# 회원 CRUD, 숙련도·단위 설정

│ ├── spots/ \# 스팟 CRUD, 반경 검색 (marina_info 포함)

│ ├── weather/ \# 기상·관측소 조회

│ ├── scores/ \# 활동 지수 조회

│ ├── alerts/ \# 알림 설정·이력

│ ├── favorites/ \# 즐겨찾기

│ ├── community/ \# 리포트·리뷰

│ ├── spot-requests/ \# 스팟 추가 요청

│ ├── subscriptions/ \# 구독·결제 웹훅

│ ├── admin/ \# 관리자 전용 API

│ ├── tiles/ \# 타일 제공 (Ph.2)

│ ├── workers/ \# Cron Workers (기상·지수·알림)

│ ├── common/ \# Guard, Interceptor, DTO, Pipe

│ └── config/ \# 환경변수, DB 연결 설정

├── prisma/ \# Prisma ORM 스키마

├── docker-compose.yml \# 로컬 개발 환경

└── .env.example

**4.2 인증 설계**

  -----------------------------------------------------------------------
  **항목**         **내용**
  ---------------- ------------------------------------------------------
  Access Token     JWT. 만료 1시간. 사용자 ID·이메일·구독 등급(free/pro)
                   페이로드 포함.

  Refresh Token    Opaque 토큰. 만료 30일. Redis에 저장 (키:
                   refresh:{userId}). 재발급 시 기존 토큰 무효화.

  소셜 로그인 흐름 앱에서 카카오·애플·구글 SDK로 소셜 토큰 획득 → 서버
                   /auth/{provider}에 소셜 토큰 전송 → 서버에서 검증 후
                   WAVESPOT JWT 발급.

  Pro 검증 Guard   PlanGuard: request.user.plan === \'pro\'가 아니면 403
                   반환. Expert View·관측소 데이터 등 Pro 전용 API에
                   적용.

  관리자 Guard     AdminGuard: users.role === \'admin\' 검증. Admin 전용
                   API에 적용.
  -----------------------------------------------------------------------

**4.3 스팟 반경 검색 쿼리 (PostGIS)**

사용자 위치 기준 N km 내 스팟을 효율적으로 조회하기 위해 PostGIS의
ST_DWithin 함수를 사용합니다.

\-- 사용자 위치에서 반경 30km 내 스팟 조회 (서핑 스팟만)

SELECT s.id, s.name, s.location::text,

ST_Distance(s.location, ST_MakePoint(:lng, :lat)::geography) / 1000 AS
distance_km

FROM spots s

WHERE ST_DWithin(s.location, ST_MakePoint(:lng, :lat)::geography, 30000)

AND \'surfing\' = ANY(s.spot_types)

AND s.is_active = true

ORDER BY distance_km ASC;

**4.4 Rate Limiting 전략**

  -----------------------------------------------------------------------
  **엔드포인트 그룹**    **제한**         **기준**
  ---------------------- ---------------- -------------------------------
  일반 API (GET /spots,  100건 / 분       IP 기준
  /weather 등)                            

  인증 API (POST         10건 / 분        IP 기준 (브루트포스 방지)
  /auth/\*)                               

  이미지 업로드          20건 / 시간      유저 기준

  스팟 추가 요청         3건 / 일         Pro 유저 기준

  기상 타일 API          200건 / 분       IP 기준 (CDN 캐싱으로 실제 서버
                                          도달 최소화)
  -----------------------------------------------------------------------

**5. Flutter 앱 (iOS · Android) 설계**

**5.1 프로젝트 구조**

wavespot-app/

├── lib/

│ ├── main.dart

│ ├── app.dart \# MaterialApp, 테마, 라우팅

│ ├── core/

│ │ ├── theme/ \# 컬러 토큰, 타이포, 다크모드

│ │ ├── network/ \# Dio HTTP 클라이언트, 인터셉터

│ │ ├── storage/ \# Hive 로컬 캐시, SecureStorage

│ │ └── router/ \# go_router 라우팅 설정

│ ├── features/

│ │ ├── map/ \# 메인 지도, 마커, 레이어

│ │ ├── spot/ \# 바텀시트, 스팟 상세 (marina_info 조건부 표시)

│ │ ├── forecast/ \# 예보 그래프, 모델 비교

│ │ ├── observation/ \# 관측소 실시간 (Pro)

│ │ ├── favorites/ \# 즐겨찾기 목록

│ │ ├── alerts/ \# 알림 설정

│ │ ├── community/ \# 리포트·리뷰

│ │ ├── auth/ \# 로그인·회원가입

│ │ ├── subscription/ \# 구독·결제

│ │ └── settings/ \# 마이페이지, 단위, 테마

│ └── shared/ \# 공통 위젯, 유틸, 상수

├── ios/

│ └── Runner/WidgetExtension/ \# iOS 홈 위젯

└── android/

└── app/src/main/widget/ \# Android 홈 위젯

**5.2 상태 관리 --- Riverpod**

Flutter 앱의 상태 관리는 Riverpod(v2)를 사용합니다. Provider보다 타입
안전성이 높고, 비동기 데이터 처리·캐싱이 간결합니다.

  ---------------------------------------------------------------------------------
  **Provider 종류**       **사용 케이스**        **예시**
  ----------------------- ---------------------- ----------------------------------
  AsyncNotifierProvider   API 데이터 로드·갱신   currentConditionProvider(spotId)

  StateNotifierProvider   UI 상태 관리           viewModeProvider (simple/expert)

  StreamProvider          실시간 데이터 스트림   weatherAlertStreamProvider

  FutureProvider          1회성 데이터 로드      spotDetailProvider(spotId)
  ---------------------------------------------------------------------------------

**5.3 네이버 지도 통합**

  -----------------------------------------------------------------------------------------------------------
  **기능**           **구현 방법**              **주의사항**
  ------------------ -------------------------- -------------------------------------------------------------
  지도 렌더링        flutter_naver_map 패키지   NCP 앱 등록 및 API 키 발급 필수
                     (pub.dev)                  

  스팟 마커          NMarker + 커스텀 이미지    마커 수 500개 이상 시 클러스터링 적용
                     (등급별 색상 PNG)          

  바텀시트 연동      마커 onTap →               마커 탭과 지도 이동 이벤트 충돌 주의
                     DraggableScrollableSheet   
                     표시                       

  풍향 화살표 (MVP)  NAddableOverlay →          스팟마다 1개 생성, 풍향 degree로 rotation 적용
                     NGroundOverlay로 화살표    
                     PNG 오버레이               

  타일 오버레이      NTileOverlay로 서버 타일   타일 URL:
  (Ph.2)             URL 패턴 등록              https://cdn.wavespot.kr/tiles/{z}/{x}/{y}.png?t={timestamp}

  지도 이동 쓰로틀링 onCameraIdle 이벤트에서만  onCameraMove 시 무한 API 호출 방지
                     마커 갱신                  
  -----------------------------------------------------------------------------------------------------------

**5.4 Simple ↔ Expert 뷰 구현**

// viewModeProvider --- Riverpod StateProvider

final viewModeProvider = StateProvider\<ViewMode\>((ref) {

final userLevel = ref.watch(userLevelProvider);

return userLevel == UserLevel.beginner ? ViewMode.simple :
ViewMode.expert;

});

// 스팟 상세 화면에서 조건부 렌더링

Consumer(builder: (context, ref, \_) {

final mode = ref.watch(viewModeProvider);

return mode == ViewMode.simple

? SimpleConditionCard(score: score) // 자연어 카드

: ExpertConditionCard(data: weather); // 수치 전체 카드

})

**5.5 오프라인 캐시 전략**

  ---------------------------------------------------------------------------------
  **캐시         **라이브러리**           **저장 내용**         **만료**
  레이어**                                                      
  -------------- ------------------------ --------------------- -------------------
  메모리 캐시    Riverpod 자체            API 응답 (앱 실행 중) 앱 종료 시 소멸

  로컬 캐시      Hive (NoSQL)             기상 스냅샷, 스팟     TTL 6시간 (Pro)
                                          기본 정보             

  이미지 캐시    cached_network_image     스팟 커버 이미지      TTL 7일

  보안 저장소    flutter_secure_storage   JWT Access/Refresh    앱 삭제 시 소멸
                                          토큰                  
  ---------------------------------------------------------------------------------

**5.6 홈 위젯**

  ---------------------------------------------------------------------------
  **플랫폼**   **구현 기술**            **제공 정보**              **갱신
                                                                   주기**
  ------------ ------------------------ -------------------------- ----------
  iOS          WidgetKit (Swift) +      즐겨찾기 최대 2개 스팟:    15\~60분
               Flutter 공유 데이터 (App 등급 색상 + 스팟명 + 풍속  (iOS 정책)
               Group)                                              

  Android      AppWidget (Kotlin) +     동일                       30분\~
               Flutter 공유                                        
               SharedPreferences                                   
  ---------------------------------------------------------------------------

⚠️ 홈 위젯은 앱과 독립 프로세스로 동작합니다. Flutter → Native 데이터
공유 시 iOS는 App Group, Android는 SharedPreferences를 사용하며, 위젯
자체는 Native(Swift/Kotlin)로 구현해야 합니다.

**6. 관리자 웹 대시보드 (Admin Web)**

**6.1 기술 스택**

  ------------------------------------------------------------------------
  **항목**      **선택**             **이유**
  ------------- -------------------- -------------------------------------
  프레임워크    Next.js 14 (App      SSR·SSG 혼합, 빠른 개발 속도
                Router)              

  UI 라이브러리 shadcn/ui + Tailwind 고품질 컴포넌트, 커스터마이징 용이
                CSS                  

  지도          네이버 지도          스팟 위치 확인·핀 지정
                JavaScript API       

  테이블·필터   TanStack Table       스팟 목록 정렬·필터·페이지네이션

  차트          Recharts             데이터 모니터링 차트

  인증          NextAuth.js (어드민  이메일+비밀번호. 소셜 로그인 불필요
                계정)                

  배포          Vercel 또는 AWS      Next.js 최적화 배포
                Amplify              
  ------------------------------------------------------------------------

**6.2 주요 화면**

  -----------------------------------------------------------------------
  **화면**             **주요 기능**
  -------------------- --------------------------------------------------
  대시보드 홈          MAU·구독자 수·스팟 수·오늘 API 호출량 요약 카드

  스팟 관리            스팟 목록 테이블 (필터·검색), 스팟
                       등록/수정/비활성화, marina 타입 선택 시
                       marina_info 필드 조건부 표시

  스팟 요청 검토       요청 목록 (pending 우선), 지도로 위치 확인,
                       승인/반려 처리, 반려 사유 입력

  공공데이터 Import    CSV·GeoJSON 업로드 → 미리보기 → 일괄 스팟 등록

  기상 데이터 모니터링 스팟별 마지막 기상 수집 시각, API 오류 현황, 수집
                       실패 알림

  유저 관리            회원 목록, 구독 상태, Pro 강제 부여/해제
                       (테스트용)

  구독·결제 현황       플랜별 구독자 수, MRR(월 반복 수익), 해지율
  -----------------------------------------------------------------------

**6.3 스팟 관리 데이터 흐름**

-   관리자가 공공데이터 GeoJSON 업로드 → 서버에서 파싱 → 미리보기(지도
    핀 표시) → 확인 클릭 → spots 테이블 Bulk INSERT

-   marina 타입 스팟 등록 시 spots.spot_types에 \'marina\' 포함 +
    marina_info JSONB 필드 함께 저장 (단일 트랜잭션, 별도 테이블 없음)

-   스팟 요청 승인: spot_requests.status → approved, spots 신규 INSERT,
    요청자에게 FCM 알림

-   스팟 비활성화: spots.is_active = false → 앱 지도에서 즉시 숨김
    (Weather Worker도 수집 제외)

**7. 데이터베이스 상세 스키마**

**7.1 users 테이블**

  ----------------------------------------------------------------------------------------------
  **컬럼**         **타입**                               **제약**            **설명**
  ---------------- -------------------------------------- ------------------- ------------------
  id               UUID                                   PK DEFAULT          사용자 고유 ID
                                                          gen_random_uuid()   

  email            VARCHAR(255)                           UNIQUE NOT NULL     이메일

  nickname         VARCHAR(50)                            NOT NULL            닉네임

  avatar_url       TEXT                                                       프로필 이미지 URL

  role             ENUM(user/admin)                       DEFAULT \'user\'    권한

  plan             ENUM(free/pro)                         DEFAULT \'free\'    구독 등급

  skill_level      ENUM(beginner/intermediate/advanced)   DEFAULT             숙련도 (뷰 기본값
                                                          \'beginner\'        결정)

  unit_wind        ENUM(ms/knots/kmh)                     DEFAULT \'ms\'      풍속 단위

  unit_wave        ENUM(m/ft)                             DEFAULT \'m\'       파고 단위

  dark_mode        BOOLEAN                                DEFAULT FALSE       다크모드 여부

  fcm_token        TEXT                                                       FCM 푸시 토큰

  kakao_id         VARCHAR(100)                           UNIQUE              카카오 소셜 ID

  apple_id         VARCHAR(100)                           UNIQUE              애플 소셜 ID

  google_id        VARCHAR(100)                           UNIQUE              구글 소셜 ID

  created_at       TIMESTAMPTZ                            DEFAULT NOW()       가입 시각

  deleted_at       TIMESTAMPTZ                                                탈퇴 시각 (소프트
                                                                              삭제)
  ----------------------------------------------------------------------------------------------

**7.2 spots 테이블 (v1.3 최종)**

  --------------------------------------------------------------------------------------------------
  **컬럼**               **타입**                                   **설명**
  ---------------------- ------------------------------------------ --------------------------------
  id                     UUID PK                                    스팟 고유 ID

  name                   VARCHAR(100) NOT NULL                      스팟 한국어 명칭 (영문명 name_en
                                                                    삭제)

  location               GEOGRAPHY(POINT,4326) NOT NULL             좌표 (PostGIS)

  address                VARCHAR(200)                               도로명 주소

  region                 ENUM(east_sea/west_sea/south_sea/inland)   지역 구분
                         NOT NULL                                   

  spot_types             TEXT\[\] NOT NULL                          종목 배열 \[surfing, yacht,
                                                                    marina, waterski, kayak, diving,
                                                                    kitesurf, sup, wakeboard\]

  depth_avg              FLOAT                                      평균 수심 (m)

  bottom_type            ENUM(sand/rock/coral/mud/mixed)            해저 지형

  difficulty             ENUM(beginner/intermediate/advanced) NOT   진입 난이도
                         NULL                                       

  amenities              JSONB                                      편의시설 JSON
                                                                    (주차·샤워·렌탈샵·구조대)

  season_start           SMALLINT                                   권장 시즌 시작 월

  season_end             SMALLINT                                   권장 시즌 종료 월

  hazard_notes           TEXT                                       위험 요소 메모 (이안류·암초 등)

  cover_image_url        TEXT                                       대표 이미지 URL

  image_urls             TEXT\[\]                                   추가 이미지 URL 배열

  info_cards             JSONB\[\]                                  이미지+텍스트 스와이프 카드 배열

  marina_info            JSONB                                      마리나 전용 데이터 --- marina
                                                                    타입만 사용 (나머지 null) {
                                                                    operator, max_berths,
                                                                    max_vessel_length,
                                                                    max_vessel_draft, yacht_rental,
                                                                    sailing_school, fuel_available,
                                                                    entry_fee_note }

  homepage_url           TEXT                                       공식 홈페이지 URL

  reservation_url        TEXT                                       예약 페이지 URL (네이버예약·자사
                                                                    등)

  phone                  VARCHAR(20)                                대표 전화번호

  sns_url                JSONB                                      SNS 링크 {instagram, youtube,
                                                                    kakao_channel}

  operating_hours        VARCHAR(200)                               운영 시간

  closed_days            VARCHAR(100)                               휴무일

  price_info             TEXT                                       이용 요금 안내

  reservation_required   BOOLEAN DEFAULT FALSE                      사전 예약 필수 여부

  is_active              BOOLEAN DEFAULT TRUE                       앱 표시 여부

  created_at             TIMESTAMPTZ DEFAULT NOW()                  생성 시각

  updated_at             TIMESTAMPTZ                                수정 시각
  --------------------------------------------------------------------------------------------------

**7.3 weather_snapshots 테이블 (파티셔닝 권장)**

  ------------------------------------------------------------------------
  **컬럼**          **타입**           **설명**
  ----------------- ------------------ -----------------------------------
  id                BIGSERIAL PK       자동 증가

  spot_id           UUID FK → spots    연결 스팟 (인덱스 필수)

  recorded_at       TIMESTAMPTZ NOT    기상 기준 시각 (파티션 키)
                    NULL               

  wind_speed        FLOAT              풍속 m/s

  wind_direction    SMALLINT           풍향 0\~360°

  wind_gust         FLOAT              돌풍 m/s

  wave_height_sig   FLOAT              유의 파고 m

  wave_height_max   FLOAT              최대 파고 m

  wave_period       FLOAT              파주기 초

  wave_direction    SMALLINT           파향 degree

  swell_height      FLOAT              너울 높이 m

  swell_period      FLOAT              너울 주기 초

  swell_direction   SMALLINT           너울 방향 degree

  sea_temp          FLOAT              수온 °C

  air_temp          FLOAT              기온 °C

  feels_like        FLOAT              체감온도 °C

  precipitation     FLOAT              강수량 mm/h

  precip_prob       SMALLINT           강수확률 %

  visibility        FLOAT              시정 km

  uv_index          FLOAT              자외선 지수

  weather_code      SMALLINT           날씨 코드 (WMO 기준)

  source            VARCHAR(50)        데이터 출처
                                       (kma/openmeteo/stormglass)
  ------------------------------------------------------------------------

ℹ️ weather_snapshots는 시계열 데이터로 빠르게 쌓입니다. PostgreSQL
파티셔닝(RANGE by recorded_at, 월별)을 적용하고 30일 이상 된 데이터는
자동 삭제(pg_partman)를 권장합니다.

**7.4 activity_scores 테이블**

  -------------------------------------------------------------------------------------------------------
  **컬럼**          **타입**                         **설명**
  ----------------- -------------------------------- ----------------------------------------------------
  id                BIGSERIAL PK                     자동 증가

  spot_id           UUID FK → spots                  연결 스팟

  sport             VARCHAR(30) NOT NULL             종목 코드
                                                     (surfing/yacht/waterski/kayak/diving/kitesurf/sup)

  scored_at         TIMESTAMPTZ NOT NULL             점수 기준 시각

  score             SMALLINT NOT NULL                0\~100 점수

  grade             ENUM(excellent/good/fair/poor)   등급
                    NOT NULL                         

  simple_message    TEXT                             Simple View용 자연어 메시지 (한국어)

  best_time_start   TIMESTAMPTZ                      오늘 최적 시간대 시작

  best_time_end     TIMESTAMPTZ                      오늘 최적 시간대 종료

  penalty_applied   BOOLEAN DEFAULT FALSE            안전 패널티 적용 여부

  alert_override    BOOLEAN DEFAULT FALSE            기상특보 강제 POOR 여부
  -------------------------------------------------------------------------------------------------------

**7-A. 종목별 활동 지수 가중치 (Score Engine 기준)**

Score Engine은 수집된 기상 항목을 0\~100점으로 정규화한 뒤, 종목별
가중치 테이블을 적용해 최종 점수를 계산합니다. 아래 가중치는 초기
기준값이며, 전문가 자문 및 유저 피드백을 통해 지속 보정됩니다.

⚠️ 단일 항목이 안전 임계값을 초과하면 가중 평균과 무관하게 최종 점수를
0점으로 강제합니다 (안전 패널티). 기상특보 발령 시에도 동일하게 0점
처리합니다.

**7-A.1 가중치 테이블 (단위: %)**

  -------------------------------------------------------------------------------------------------------------------------------
  **기상 항목**   **서핑**   **요트·세일링**   **마리나   **수상스키·웨이크**   **카약·SUP**   **다이빙·스노클링**   **킷서핑**
                                               입출항**                                                              
  --------------- ---------- ----------------- ---------- --------------------- -------------- --------------------- ------------
  파고 (Wave      35         15                20         20                    15             10                    20
  Height)                                                                                                            

  파주기 (Wave    20         5                 5          5                     5              5                     5
  Period)                                                                                                            

  너울 (Swell)    15         10                10         5                     10             10                    10

  풍속 (Wind      15         30                25         20                    20             10                    35
  Speed)                                                                                                             

  풍향 (Wind      5          15                15         10                    10             5                     20
  Dir.)                                                                                                              

  수온 (Sea Temp) 5          5                 5          10                    15             25                    5

  조류 (Current)  3          10                10         15                    15             20                    3

  시정            2          10                10         5                     5              10                    2
  (Visibility)                                                                                                       

  강수 (Precip)   0          0                 0          10                    5              5                     0

  합계            100        100               100        100                   100            100                   100
  -------------------------------------------------------------------------------------------------------------------------------

**7-A.2 등급 기준 및 안전 임계값**

  ------------------------------------------------------------------------
  **등급**      **점수 범위** **색상**           **의미**
  ------------- ------------- ------------------ -------------------------
  EXCELLENT     85\~100       #10B981 (초록)     최적 조건 --- 강력 추천

  GOOD          65\~84        #3B82F6 (파랑)     활동 가능 --- 추천

  FAIR          40\~64        #F59E0B (노랑)     주의 필요 --- 경험자 권장

  POOR          0\~39         #EF4444 (빨강)     활동 비추천 --- 위험
                                                 가능성
  ------------------------------------------------------------------------

  ----------------------------------------------------------------------------
  **종목**          **풍속 안전 임계값 **파고 안전 임계값 **비고**
                    (강제 POOR)**      (강제 POOR)**      
  ----------------- ------------------ ------------------ --------------------
  서핑              14 m/s 이상 (27kt) 4.0m 이상          너울 단독 3m 이상도
                                                          POOR

  요트·세일링       20 m/s 이상 (39kt) 3.5m 이상          기상특보 발령 시
                                                          입출항 금지

  마리나 입출항     15 m/s 이상        2.5m 이상          흘수 조건 미충족
                                                          시도 POOR

  수상스키·웨이크   12 m/s 이상        1.5m 이상          내수면은 파고 항목
                                                          제외

  카약·SUP          10 m/s 이상        1.5m 이상          입문자 기준 ---
                                                          고급자 필드 추가
                                                          예정

  다이빙·스노클링   12 m/s 이상        2.0m 이상          조류 0.8kt 이상도
                                                          POOR

  킷서핑            18 m/s 이상 (35kt) 3.0m 이상          최소 풍속 5 m/s
                                                          미만도 POOR
  ----------------------------------------------------------------------------

ℹ️ 안전 임계값은 SRS의 법적 면책 조항과 연동됩니다. 이 값을 낮추면
보수적(안전), 높이면 자유도가 높아집니다. 초기에는 보수적 기준으로
출시하고 점진적으로 조정합니다.

**7-B. API 에러 코드 표준 정의**

모든 에러 응답은 { success: false, error: { code, message } } 형식으로
반환합니다. 클라이언트는 code 값을 기반으로 UI 처리를 합니다.

**7-B.1 인증 관련 (AUTH\_\*)**

  ---------------------------------------------------------------------------
  **코드**               **HTTP**   **설명**               **클라이언트
                                                           처리**
  ---------------------- ---------- ---------------------- ------------------
  AUTH_TOKEN_MISSING     401        Authorization 헤더     로그인 화면으로
                                    없음                   이동

  AUTH_TOKEN_EXPIRED     401        Access Token 만료      Refresh Token으로
                                                           재발급 후 재시도

  AUTH_TOKEN_INVALID     401        서명 검증 실패 또는    로그아웃 처리 후
                                    변조된 토큰            재로그인 요청

  AUTH_REFRESH_EXPIRED   401        Refresh Token도 만료   강제 로그아웃,
                                                           재로그인 요청

  AUTH_SOCIAL_FAILED     400        소셜 토큰 서버 검증    소셜 로그인 재시도
                                    실패                   안내

  AUTH_FORBIDDEN         403        권한 없음 (role        접근 불가 안내
                                    불일치)                
  ---------------------------------------------------------------------------

**7-B.2 구독 플랜 관련 (PLAN\_\*)**

  ---------------------------------------------------------------------------
  **코드**               **HTTP**   **설명**               **클라이언트
                                                           처리**
  ---------------------- ---------- ---------------------- ------------------
  PLAN_REQUIRED          403        Pro 전용 기능에 Free   구독 유도 Paywall
                                    사용자 접근            팝업 표시

  PLAN_LIMIT_FAVORITES   403        즐겨찾기 최대 2개 초과 \'Pro로
                                    시도 (Free)            업그레이드하면
                                                           무제한\' 팝업

  PLAN_LIMIT_REPORTS     403        커뮤니티 작성 시도     구독 유도 팝업
                                    (Free)                 
  ---------------------------------------------------------------------------

**7-B.3 스팟 관련 (SPOT\_\*)**

  ----------------------------------------------------------------------------
  **코드**                **HTTP**   **설명**               **클라이언트
                                                            처리**
  ----------------------- ---------- ---------------------- ------------------
  SPOT_NOT_FOUND          404        존재하지 않거나        \'스팟을 찾을 수
                                     비활성화된 스팟        없습니다\' 안내

  SPOT_DUPLICATE          409        반경 500m 내 이미 동일 기존 스팟 안내 및
                                     스팟 존재 (요청 시)    중복 마커 표시

  SPOT_REQUEST_LIMIT      429        스팟 요청 일일         \'오늘 요청 한도를
                                     한도(3건) 초과         초과했습니다\'
                                                            안내

  SPOT_INVALID_LOCATION   400        좌표 범위 오류         위치 재설정 요청
                                     (대한민국 영역 외)     
  ----------------------------------------------------------------------------

**7-B.4 기상·데이터 관련 (WEATHER\_\*)**

  ------------------------------------------------------------------------------
  **코드**                  **HTTP**   **설명**               **클라이언트
                                                              처리**
  ------------------------- ---------- ---------------------- ------------------
  WEATHER_NOT_READY         503        해당 스팟 기상 데이터  \'데이터 준비
                                       미수집 (신규 스팟 등)  중입니다\' 안내,
                                                              재시도 버튼

  WEATHER_STALE             200 (경고) 캐시 데이터가 2시간    \'일부 데이터가
                                       이상 오래됨            최신이 아닐 수
                                                              있습니다\' 배너

  OBSERVATION_UNAVAILABLE   404        반경 50km 내 관측소    \'인근 관측소
                                       없음                   없음\' 안내
  ------------------------------------------------------------------------------

**7-B.5 공통 서버 관련 (SERVER\_\*, RATE\_\*)**

  ---------------------------------------------------------------------------
  **코드**               **HTTP**   **설명**               **클라이언트
                                                           처리**
  ---------------------- ---------- ---------------------- ------------------
  RATE_LIMIT_EXCEEDED    429        Rate Limit 초과        잠시 후 재시도
                                                           안내 (Retry-After
                                                           헤더 참고)

  VALIDATION_ERROR       400        요청 파라미터 유효성   각 필드별 오류
                                    검사 실패              메시지 표시

  SERVER_INTERNAL        500        서버 내부 오류         \'일시적인
                                                           오류입니다. 잠시
                                                           후 다시
                                                           시도해주세요\' +
                                                           Sentry 자동 보고

  SERVER_MAINTENANCE     503        점검 중                점검 안내 화면으로
                                                           대체
  ---------------------------------------------------------------------------

**7-C. FCM 푸시 알림 메시지 포맷**

Notification Worker가 발송하는 모든 FCM 메시지의 제목·내용·딥링크 포맷을
정의합니다. 앱은 알림 탭 시 data.spotId를 읽어 해당 스팟 상세 화면으로
이동합니다.

**7-C.1 컨디션 알림 (Pro 전용)**

  -------------------------------------------------------------------------------------------------
  **등급**    **제목 (title)**   **내용 (body)**          **딥링크**
  ----------- ------------------ ------------------------ -----------------------------------------
  EXCELLENT   🏄 {스팟명} 지금   {종목} 하기 완벽한       wavespot://spots/{spotId}?sport={sport}
              최고예요!          조건입니다. 지금 바로    
                                 출발하세요!              

  GOOD        ✅ {스팟명} 활동   {종목} 조건이 좋습니다.  wavespot://spots/{spotId}?sport={sport}
              가능해요           오늘 다녀오기 좋아요.    

  FAIR        ⚠️ {스팟명}        {종목} 조건이            wavespot://spots/{spotId}?sport={sport}
              주의하세요         까다롭습니다. 경험자에게 
                                 권장합니다.              
  -------------------------------------------------------------------------------------------------

**7-C.2 기상특보 알림 (전체 사용자)**

  ----------------------------------------------------------------------------------
  **유형**    **제목 (title)**   **내용 (body)**         **딥링크**
  ----------- ------------------ ----------------------- ---------------------------
  경보 발령   🚨 기상경보 ---    {특보명} 발령. 즉각적인 wavespot://spots/{spotId}
              {스팟명} 인근      위험이 있습니다.        
                                 출항·입수를 삼가세요.   

  주의보 발령 ⚠️ 기상주의보 ---  {특보명} 발령. 해당     wavespot://spots/{spotId}
              {스팟명} 인근      지역 활동 시 각별히     
                                 주의하세요.             

  특보 해제   ✅ 기상특보 해제   발령 중이던 {특보명}이  wavespot://spots/{spotId}
              --- {스팟명}       해제되었습니다.         
  ----------------------------------------------------------------------------------

**7-C.3 스팟 요청 알림**

  ------------------------------------------------------------------------------------
  **유형**    **제목 (title)**   **내용 (body)**         **딥링크**
  ----------- ------------------ ----------------------- -----------------------------
  요청 접수   📍 스팟 요청이     \'{스팟명}\' 요청을     wavespot://profile/requests
              접수됐어요         받았습니다. 검토 후     
                                 알려드릴게요.           

  요청 승인   🎉 \'{스팟명}\'    요청하신 스팟이         wavespot://spots/{spotId}
              스팟이 추가됐어요  등록됐습니다. 지금 바로 
                                 확인해보세요!           

  요청 반려   ❌ 스팟 요청이     \'{스팟명}\' 요청이     wavespot://profile/requests
              반려됐어요         반려됐습니다. 앱에서    
                                 사유를 확인하세요.      
  ------------------------------------------------------------------------------------

ℹ️ FCM 메시지 payload의 data 객체에 spotId, sport, type 필드를 항상
포함합니다. 앱의 FirebaseMessaging.onMessageOpenedApp 핸들러에서 data를
읽어 딥링크를 처리합니다.

// FCM data payload 구조

data: {

type: \'condition_alert\' \| \'weather_alert\' \| \'spot_request\',

spotId: \'uuid\',

sport: \'surfing\' \| \'yacht\' \| \... \| null,

grade: \'excellent\' \| \'good\' \| \'fair\' \| \'poor\' \| null

}

**7-D. Prisma 스키마 핵심 코드 (schema.prisma)**

구현 시 직접 사용하는 schema.prisma 핵심 부분입니다. PostGIS 지리 타입은
Prisma의 Unsupported() 타입으로 선언하고, 좌표 조작은 \$queryRaw로
처리합니다.

**7-D.1 generator / datasource 설정**

generator client {

provider = \"prisma-client-js\"

previewFeatures = \[\"postgresqlExtensions\"\]

}

datasource db {

provider = \"postgresql\"

url = env(\"DATABASE_URL\")

extensions = \[postgis\]

}

**7-D.2 spots 모델 (핵심)**

model Spot {

id String \@id \@default(dbgenerated(\"gen_random_uuid()\")) \@db.Uuid

name String \@db.VarChar(100)

// name_en 없음 --- 한국 서비스 전용

location Unsupported(\"geography(Point, 4326)\")

address String? \@db.VarChar(200)

region Region

spotTypes String\[\] \@map(\"spot_types\")

depthAvg Float? \@map(\"depth_avg\")

bottomType BottomType? \@map(\"bottom_type\")

difficulty Difficulty

amenities Json?

seasonStart Int? \@map(\"season_start\")

seasonEnd Int? \@map(\"season_end\")

hazardNotes String? \@map(\"hazard_notes\")

coverImageUrl String? \@map(\"cover_image_url\")

imageUrls String\[\] \@map(\"image_urls\")

infoCards Json\[\] \@map(\"info_cards\")

// 마리나 전용 --- marina 타입일 때만 사용, 나머지는 null

// 별도 테이블 없음

marinaInfo Json? \@map(\"marina_info\")

// 예약·연락처 (v1.3 신규)

homepageUrl String? \@map(\"homepage_url\")

reservationUrl String? \@map(\"reservation_url\")

phone String? \@db.VarChar(20)

snsUrl Json? \@map(\"sns_url\")

operatingHours String? \@map(\"operating_hours\")

closedDays String? \@map(\"closed_days\")

priceInfo String? \@map(\"price_info\")

reservationRequired Boolean \@default(false)
\@map(\"reservation_required\")

isActive Boolean \@default(true) \@map(\"is_active\")

createdAt DateTime \@default(now()) \@map(\"created_at\")

updatedAt DateTime \@updatedAt \@map(\"updated_at\")

weatherSnapshots WeatherSnapshot\[\]

activityScores ActivityScore\[\]

@@map(\"spots\")

}

**7-D.3 Enum 정의**

enum Region { east_sea west_sea south_sea inland }

enum BottomType { sand rock coral mud mixed }

enum Difficulty { beginner intermediate advanced }

enum Plan { free pro }

enum Role { user admin }

enum SkillLevel { beginner intermediate advanced }

enum StationT { aws buoy koem }

**7-D.4 반경 검색 Raw Query (PostGIS)**

// SpotsService.findNear() 구현 예시

const spots = await this.prisma.\$queryRaw\`

SELECT id, name, spot_types,

ST_X(location::geometry) AS lng,

ST_Y(location::geometry) AS lat,

ST_Distance(location, ST_MakePoint(\${lng}, \${lat})::geography) / 1000
AS distance_km

FROM spots

WHERE ST_DWithin(location, ST_MakePoint(\${lng}, \${lat})::geography,
\${radiusMeters})

AND \${sport}::text = ANY(spot_types)

AND is_active = true

ORDER BY distance_km ASC

LIMIT \${limit} OFFSET \${offset}

\`

⚠️ Unsupported 타입 컬럼(location)은 Prisma의 일반 create/update로
저장할 수 없습니다. \$executeRaw로 ST_MakePoint()를 사용해 INSERT/UPDATE
해야 합니다.

**8. REST API 엔드포인트 명세**

**8.1 인증**

  ---------------------------------------------------------------------------------
  **Method**   **Endpoint**       **인증**   **설명**
  ------------ ------------------ ---------- --------------------------------------
  POST         /auth/kakao        없음       카카오 토큰으로 로그인·회원가입

  POST         /auth/apple        없음       애플 토큰으로 로그인·회원가입

  POST         /auth/google       없음       구글 토큰으로 로그인·회원가입

  POST         /auth/refresh      없음       Refresh Token으로 Access Token 갱신

  DELETE       /auth/logout       JWT        로그아웃 (Refresh Token 삭제)
  ---------------------------------------------------------------------------------

**8.2 스팟**

  ----------------------------------------------------------------------------------
  **Method**   **Endpoint**       **인증**     **설명**
  ------------ ------------------ ------------ -------------------------------------
  GET          /spots             JWT(선택)    스팟 목록. Query: lat, lng, radius,
                                               sport, region, page, limit

  GET          /spots/:id         없음         스팟 상세 (마리나이면 marina 데이터
                                               포함)

  GET          /spots/near        없음         반경 내 스팟 목록. Query: lat, lng,
                                               radius(km)

  POST         /spots             AdminGuard   스팟 등록 (관리자)

  PATCH        /spots/:id         AdminGuard   스팟 수정 (관리자)

  DELETE       /spots/:id         AdminGuard   스팟 비활성화 (관리자, soft delete)
  ----------------------------------------------------------------------------------

**8.3 기상·지수·조석**

  ------------------------------------------------------------------------------------------
  **Method**   **Endpoint**                   **인증**   **설명**
  ------------ ------------------------------ ---------- -----------------------------------
  GET          /weather/:spotId/current       없음       현재 기상 데이터 (Redis 캐시 우선)

  GET          /weather/:spotId/forecast      없음       7일 시간별 예보 배열

  GET          /weather/:spotId/tides         없음       조석 예보 (오늘+3일)

  GET          /weather/:spotId/observation   ProGuard   관측소 실시간 데이터 (Pro 전용)

  GET          /scores/:spotId                없음       종목별 현재 활동 지수. Query: sport

  GET          /scores/:spotId/timeline       없음       7일 시간별 지수 타임라인
  ------------------------------------------------------------------------------------------

**8.4 알림·즐겨찾기·커뮤니티**

  ----------------------------------------------------------------------------------
  **Method**   **Endpoint**         **인증**     **설명**
  ------------ -------------------- ------------ -----------------------------------
  GET          /alerts              JWT          내 알림 설정 목록

  POST         /alerts              ProGuard     알림 설정 등록

  DELETE       /alerts/:id          ProGuard     알림 설정 삭제

  GET          /favorites           JWT          내 즐겨찾기 목록

  POST         /favorites           JWT          즐겨찾기 추가 (Free: 최대 2개 서버
                                                 검증)

  DELETE       /favorites/:spotId   JWT          즐겨찾기 삭제

  GET          /reports?spotId=     없음         커뮤니티 리포트 목록 (Free: 최근
                                                 3개)

  POST         /reports             ProGuard     리포트 작성 (이미지 포함 multipart)

  POST         /spot-requests       ProGuard     스팟 추가 요청

  GET          /spot-requests       AdminGuard   요청 목록 (관리자)

  PATCH        /spot-requests/:id   AdminGuard   요청 승인/반려 (관리자)
  ----------------------------------------------------------------------------------

**8.5 공통 응답 형식**

// 성공 응답

{ \"success\": true, \"data\": { \... }, \"meta\": { \"cachedAt\":
\"2026-\...\", \"source\": \"redis\" } }

// 에러 응답

{ \"success\": false, \"error\": { \"code\": \"SPOT_NOT_FOUND\",
\"message\": \"스팟을 찾을 수 없습니다.\" } }

// 페이지네이션

{ \"success\": true, \"data\": \[\...\], \"pagination\": { \"page\": 1,
\"limit\": 20, \"total\": 150 } }

**9. 인프라 및 배포**

**9.1 AWS 인프라 구성**

  ------------------------------------------------------------------------
  **서비스**         **사양             **역할**             **월 예상
                     (Production)**                          비용**
  ------------------ ------------------ -------------------- -------------
  ECS Fargate (API)  0.5 vCPU / 1GB × 2 NestJS API 서버      약 ₩40,000
                     Task               (Auto-scaling)       

  ECS Fargate        0.25 vCPU / 0.5GB  기상 수집·지수 계산  약 ₩15,000
  (Worker)           × 1 Task           Worker               

  RDS PostgreSQL     db.t3.small (2     메인 데이터베이스    약 ₩45,000
                     vCPU, 2GB)                              

  ElastiCache Redis  cache.t3.small (2  캐싱·세션·알림 큐    약 ₩25,000
                     vCPU, 1.37GB)                           

  ALB                Standard           로드 밸런서, SSL     약 ₩18,000
                                        종료                 

  S3 + CloudFront    Standard           앱 에셋, 타일 CDN    약 ₩10,000
                                        (Ph.2)               

  Route 53           호스팅 존          DNS                  약 ₩700

  합계               ---                ---                  약
                                                             ₩153,700/월
  ------------------------------------------------------------------------

ℹ️ NCloud(네이버 클라우드) 대안: 네이버 지도 API와 같은 IDC에 위치해
레이턴시 유리. 비용은 AWS 대비 5\~15% 저렴. 초기 스타트업 지원 프로그램
이용 가능.

**9.2 CI/CD 파이프라인**

  ------------------------------------------------------------------------------
  **단계**          **도구**                   **설명**
  ----------------- -------------------------- ---------------------------------
  소스 관리         GitHub                     feature → develop PR → main 머지
                    (main/develop/feature/\*   
                    브랜치 전략)               

  테스트 (자동)     GitHub Actions + Jest      PR 생성 시 자동 실행
                    (백엔드) + Flutter Test    

  빌드·컨테이너화   GitHub Actions + Docker    NestJS → Docker Image → ECR 푸시

  스테이징 배포     GitHub Actions (develop    ECS 스테이징 자동 배포
                    브랜치 머지 시)            

  프로덕션 배포     GitHub Actions (main 태그  ECS 프로덕션 Blue/Green 배포
                    생성 시)                   

  앱 배포 (iOS)     Fastlane + GitHub Actions  TestFlight → App Store Connect

  앱 배포 (Android) Fastlane + GitHub Actions  Internal Testing → Play Console
  ------------------------------------------------------------------------------

**9.3 모니터링**

  ------------------------------------------------------------------------
  **항목**        **도구**           **알림 조건**
  --------------- ------------------ -------------------------------------
  서버 에러       Sentry (Backend +  에러 발생 즉시 Slack 알림
                  Flutter)           

  서버 지표       AWS CloudWatch +   CPU \>80%, 메모리 \>85%
                  Grafana            

  API 응답 시간   CloudWatch ALB     P99 \>2초 지속 5분
                  메트릭             

  기상 수집 실패  Worker 자체 에러   수집 실패 3회 연속 시 Slack 알림
                  핸들링             

  DB 연결         RDS Performance    연결 수 임계값 초과
                  Insights           

  결제 실패       포트원 웹훅 +      결제 실패 이벤트 감지
                  Sentry             
  ------------------------------------------------------------------------

**10. 보안 체크리스트**

  --------------------------------------------------------------------------
  **항목**                 **구현 방법**                        **우선도**
  ------------------------ ------------------------------------ ------------
  HTTPS 강제               ALB에서 HTTP → HTTPS 리다이렉트.     필수
                           HSTS 헤더 적용.                      

  JWT 저장                 flutter_secure_storage (iOS Keychain 필수
                           / Android Keystore). localStorage    
                           절대 사용 금지.                      

  소셜 토큰 검증           카카오·애플·구글 서버사이드 토큰     필수
                           검증. 클라이언트 측 검증만으로 처리  
                           금지.                                

  SQL Injection            Prisma ORM 파라미터 바인딩 사용. raw 필수
                           query 최소화.                        

  이미지 업로드 검증       파일 타입·크기 서버 검증 (MIME       높음
                           sniffing 방지). R2 업로드 전         
                           바이러스 스캔(선택).                 

  Rate Limiting            \@nestjs/throttler. IP·유저 기준     높음
                           이중 제한.                           

  환경변수                 AWS Secrets Manager. .env 파일 Git   필수
                           커밋 금지.                           

  개인정보 암호화          users.email bcrypt 불필요 (평문      중간
                           저장, HTTPS로 전송 보호). 소셜 ID는  
                           평문 OK.                             

  CORS                     허용 Origin을 앱 도메인·관리자       필수
                           도메인만으로 제한.                   

  관리자 IP 화이트리스트   Admin API는 특정                     높음
                           IP(사무실·VPN)에서만 접근 가능하도록 
                           ALB Security Group 설정.             
  --------------------------------------------------------------------------

**11. 개발 환경 세팅 가이드**

**11.1 사전 준비 항목**

  -----------------------------------------------------------------------
  **항목**           **버전·내용**      **비고**
  ------------------ ------------------ ---------------------------------
  Flutter SDK        3.19.x 이상        flutter doctor로 환경 확인

  Dart SDK           3.3.x 이상         ---
                     (Flutter 내장)     

  Node.js            20 LTS             nvm 사용 권장

  PostgreSQL         16.x               PostGIS 3.x 확장 설치 필수

  Redis              7.x                로컬: Docker로 실행

  Docker Desktop     최신               로컬 DB·Redis 컨테이너 실행

  NCP (네이버        ---                네이버 지도 API 키 발급
  클라우드) 계정                        

  Firebase 프로젝트  ---                FCM 서버 키 발급

  포트원 v2 계정     ---                테스트 가맹점 등록

  Xcode              15+                iOS 빌드 (Mac 필수)

  Android Studio     최신               Android 빌드·에뮬레이터
  -----------------------------------------------------------------------

**11.2 로컬 실행 명령어**

\# 1. 저장소 클론

git clone https://github.com/your-org/wavespot-api.git

git clone https://github.com/your-org/wavespot-app.git

\# 2. 백엔드 --- Docker로 DB·Redis 실행

cd wavespot-api && docker-compose up -d

npm install && npx prisma migrate dev

npm run seed \# 초기 스팟 30개 시드 데이터

npm run start:dev \# NestJS 개발 서버 (http://localhost:3000)

\# 3. Flutter 앱 실행

cd wavespot-app && flutter pub get

cp .env.example .env \# API URL, 네이버 지도 키 등 입력

flutter run \# 연결된 에뮬레이터·디바이스에서 실행

\# 4. 관리자 웹

cd wavespot-admin && npm install && npm run dev

\# http://localhost:3001

**11.3 주요 환경변수 (.env.example)**

\# Database

DATABASE_URL=postgresql://user:password@localhost:5432/wavespot

REDIS_URL=redis://localhost:6379

\# JWT

JWT_SECRET=your-secret-key-min-32-chars

JWT_EXPIRES_IN=1h

REFRESH_TOKEN_EXPIRES_IN=30d

\# External APIs

KMA_API_KEY=기상청_API_키

KHOA_API_KEY=국립해양조사원_API_키

NAVER_MAP_CLIENT_ID=네이버_지도_클라이언트_ID

NAVER_MAP_CLIENT_SECRET=네이버_지도_시크릿

FIREBASE_PROJECT_ID=FCM_프로젝트_ID

PORTONE_API_KEY=포트원_API_키

\# Storage

R2_ACCOUNT_ID=클라우드플레어_계정_ID

R2_ACCESS_KEY=R2_액세스_키

R2_SECRET_KEY=R2_시크릿

R2_BUCKET_NAME=wavespot-media
