# Vercel 배포 가이드

## ✅ 1단계: GitHub 푸시 완료!
코드가 https://github.com/rkddus222/real-estate-manager 에 업로드되었습니다.

## 📦 2단계: Vercel에서 프로젝트 생성

### 방법 1: Vercel 웹사이트 (추천)

1. **Vercel 접속**
   - https://vercel.com 방문
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 목록에서 `real-estate-manager` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Next.js (자동 감지됨)
   - **Root Directory**: `client` 입력 ⚠️ 중요!
   - **Build Command**: 기본값 유지 (`next build`)
   - **Output Directory**: 기본값 유지

4. **환경 변수 설정 (Environment Variables)** 🔑
   **Settings > Environment Variables** 메뉴에서 다음 2가지 값을 추가하세요.
   (Supabase 대시보드 -> Project Settings -> Database에서 확인 가능)

   | Key 이름 | 설명 |
   |---|---|
   | `DATABASE_URL` | Transaction Pooler (Port 6543) `...:6543/postgres?pgbouncer=true` |
   | `DIRECT_URL` | Session Pooler (Port 5432) `...:5432/postgres` |
   
   ⚠️ **주의**: `DATABASE_URL` 끝에 `?pgbouncer=true`가 붙어있는지 꼭 확인하세요!
   *이제 복잡한 Supabase API Key는 필요 없습니다! DB 주소만 있으면 됩니다.*

5. **배포 시작**
   - "Deploy" 버튼 클릭
   - 2-3분 대기

6. **배포 완료!**
   - `https://your-project.vercel.app` 형태의 URL 생성됨
   - 해당 URL로 접속하면 앱이 작동합니다
   - **관리자 로그인 비밀번호 기본값**: `admin1234`

## 🔄 이후 업데이트 방법

코드 수정 후:
```bash
git add .
git commit -m "Update message"
git push
```
→ Vercel이 자동으로 재배포합니다!

## ⚠️ 주의사항
- Root Directory는 반드시 **`client`**로 설정하세요.
- 데이터베이스 비밀번호에 특수문자가 있다면 URL 인코딩해야 할 수도 있습니다.
- `.env` 파일은 보안상 GitHub에 올라가지 않으므로 Vercel에서 직접 설정해야 합니다.
