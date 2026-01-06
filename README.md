# 🏠 Real Estate Manager

**Real Estate Manager**는 부동산 매물을 효율적으로 관리하기 위한 웹 애플리케이션입니다. Next.js와 Prisma를 기반으로 구축되었으며, Supabase(PostgreSQL)를 데이터베이스로 사용합니다.

## ✨ 주요 기능

*   **매물 관리**: 부동산 매물 등록, 수정, 삭제 및 조회
*   **이미지 관리**: 매물 이미지 업로드 및 캐러셀 뷰어 제공
*   **관리자 인증**: 안전한 관리자 로그인 시스템
*   **반응형 디자인**: PC 및 모바일 환경 최적화 (TailwindCSS, Shadcn UI)

## 🛠️ 기술 스택

### Client (Frontend & API)
*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: TypeScript
*   **Styling**: [TailwindCSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
*   **Database ORM**: [Prisma](https://www.prisma.io/)
*   **Data Fetching**: React Server Components & Server Actions

### Infrastructure
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **Deployment**: Vercel

## 🚀 시작하기 (Getting Started)

### 1. 전제 조건 (Prerequisites)
*   Node.js (v18 이상 권장)
*   npm 또는 yarn

### 2. 설치 (Installation)

프로젝트를 클론하고 의존성을 설치합니다.

```bash
git clone https://github.com/rkddus222/real-estate-manager.git
cd real-estate-manager/client
npm install
```

### 3. 환경 변수 설정 (Environment Variables)

`client` 디렉토리에 `.env` 파일을 생성하고 다음 변수들을 설정해야 합니다.

```env
# Database Connection (Supabase)
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR_PROJECT]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Authentication (임의의 비밀번호 설정)
ADMIN_PASSWORD="admin1234"
JWT_SECRET="your-complex-secret-key"
```

### 4. 데이터베이스 마이그레이션

Prisma를 사용하여 데이터베이스 스키마를 동기화합니다.

```bash
npx prisma generate
npx prisma db push
```

### 5. 로컬 실행 (Running Locally)

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

## 📂 폴더 구조

*   `client/`: Next.js 메인 애플리케이션 (Frontend 및 Server Actions 포함)
*   `server/`: 별도의 Express 백엔드 (현재 Next.js 내부 API 사용으로 인해 선택적 사용)

## ☁️ 배포 (Deployment)

이 프로젝트는 **Vercel** 배포에 최적화되어 있습니다. 부, 자세한 배포 방법은 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) 파일을 참고하세요.

1. Vercel에서 새 프로젝트 생성
2. Root Directory를 `client`로 설정
3. 환경 변수(`DATABASE_URL`, `DIRECT_URL` 등) 등록
4. 배포 시작


