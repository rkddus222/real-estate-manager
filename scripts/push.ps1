# Git 자동 업로드 스크립트
# 사용법: .\scripts\push.ps1 "커밋 메시지(생략 가능)"

$commitMsg = $args[0]
if (-not $commitMsg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMsg = "Auto commit: $timestamp"
}

Write-Host "--- Git 연동 시작 ---" -ForegroundColor Cyan

Write-Host "> git add ." -ForegroundColor Gray
git add .

Write-Host "> git commit -m `"$commitMsg`"" -ForegroundColor Gray
git commit -m "$commitMsg"

Write-Host "> git push" -ForegroundColor Gray
git push

Write-Host "--- 업로드 완료! ---" -ForegroundColor Green
