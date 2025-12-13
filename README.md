# 🎁 언박스 어스 (Unbox Us)

**연말 파티를 위한 익명 답변 공유 게임**

👉 **[지금 플레이하기](https://unboxing.lovable.app)**

---

## 📖 소개

**언박스 어스**는 친구들과 함께하는 연말 모임을 더욱 특별하게 만들어주는 인터랙티브 파티 게임입니다.

참여자들이 미리 제출한 올해의 이야기를 선물 상자처럼 하나씩 열어보며, "이건 누가 쓴 걸까?" 추측하는 재미를 느낄 수 있어요. 마치 크리스마스 트리 아래 선물을 뜯는 것처럼, 2025년을 마무리하는 따뜻한 추억을 만들어보세요.

### ✨ 주요 기능

- **방 만들기**: 호스트가 파티 방을 생성하고 질문을 설정
- **익명 답변 수집**: 참여자들이 링크를 통해 익명으로 답변 제출
- **실시간 언박싱**: 선물 상자를 클릭해 답변을 하나씩 공개
- **3D 플립 애니메이션**: 선물 상자가 제자리에서 뒤집히는 인터랙티브 효과
- **작성자 추측 모드**: 답변만 먼저 보고, 작성자는 버튼으로 따로 공개
- **테마 선택**: 크리스마스 / 2026 말띠해 테마 지원

---

## 🎮 플레이 방법

1. **호스트**: 방을 만들고 질문을 설정한 후, 설문 링크를 친구들에게 공유
2. **참여자**: 링크를 통해 각 질문에 익명으로 답변 제출
3. **파티 시작**: 모두 모이면 호스트가 "언박싱 시작" 클릭
4. **함께 즐기기**: 선물 상자를 하나씩 열어보며 누가 썼는지 추측!

---

## 🛠 기술 스택

### Frontend
- **React 18** - 컴포넌트 기반 UI 라이브러리
- **TypeScript** - 타입 안전성을 위한 정적 타입 언어
- **Vite** - 빠른 개발 환경과 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Framer Motion** - 부드러운 애니메이션 라이브러리
- **Shadcn/UI** - 재사용 가능한 UI 컴포넌트

### Backend
- **Supabase** - PostgreSQL 기반 BaaS (Backend as a Service)
  - 실시간 데이터 동기화
  - Row Level Security (RLS)를 통한 데이터 보안

### Design
- **레트로 픽셀 아트** 스타일
- **DNF Bit Bit v2** 폰트 사용
- 반응형 디자인 (모바일/태블릿/데스크톱)

---

## 🏗 프로젝트 구조

```
src/
├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── GiftBox.tsx   # 3D 플립 선물 상자
│   ├── PixelButton.tsx
│   ├── SnowEffect.tsx
│   └── ui/           # Shadcn UI 컴포넌트
├── pages/            # 페이지 컴포넌트
│   ├── Landing.tsx   # 랜딩 페이지
│   ├── CreateRoom.tsx # 방 생성
│   ├── HostView.tsx  # 호스트 뷰 (언박싱)
│   ├── AnswerSubmission.tsx # 답변 제출
│   └── Results.tsx   # 결과 보기
├── lib/              # 유틸리티 및 API
│   └── supabase-storage.ts # Supabase 데이터 로직
└── types/            # TypeScript 타입 정의
```

---

## 🚀 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/unbox-us.git
cd unbox-us
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env
```
`.env` 파일을 열고 Supabase 프로젝트 정보를 입력하세요.

### 4. 개발 서버 실행
```bash
npm run dev
```

---

## 📊 데이터베이스 스키마

### rooms
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 방 고유 ID |
| name | TEXT | 방 이름 |
| code | TEXT | 참여 코드 (6자리) |
| theme | TEXT | 테마 (christmas/horse) |
| status | TEXT | 상태 (collecting/unboxing) |

### questions
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 질문 ID |
| room_id | UUID | 방 ID (FK) |
| text | TEXT | 질문 내용 |
| order_index | INTEGER | 질문 순서 |

### answers
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 답변 ID |
| question_id | UUID | 질문 ID (FK) |
| room_id | UUID | 방 ID (FK) |
| text | TEXT | 답변 내용 |
| author_nickname | TEXT | 작성자 닉네임 |
| is_revealed | BOOLEAN | 공개 여부 |

---

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 🤝 기여

버그 리포트나 기능 제안은 [Issues](https://github.com/your-username/unbox-us/issues)에 등록해주세요.

---

**Made with ❤️ for year-end parties**
