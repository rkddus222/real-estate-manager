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

4. **환경 변수 추가**
   "Environment Variables" 섹션에서:
   - Name: `DATABASE_URL`
   - Value: (아래 값 복사)
   ```
   postgresql://postgres:[비밀번호]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
   ```
   ⚠️ `.env` 파일에 있는 실제 비밀번호로 교체하세요!

5. **배포 시작**
   - "Deploy" 버튼 클릭
   - 2-3분 대기

6. **배포 완료!**
   - `https://your-project.vercel.app` 형태의 URL 생성됨
   - 해당 URL로 접속하면 앱이 작동합니다

## 🔄 이후 업데이트 방법

코드 수정 후:
```bash
git add .
git commit -m "Update message"
git push
```
→ Vercel이 자동으로 재배포합니다!

## ⚠️ 주의사항
- Root Directory를 **반드시 `client`로 설정**
- DATABASE_URL에 Session Pooler 주소 사용 (현재 `.env`에 있는 것)
- `.env` 파일은 GitHub에 올라가지 않으므로 Vercel에서 직접 설정 필요
