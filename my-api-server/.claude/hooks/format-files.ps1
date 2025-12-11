# .claude/hooks/format-files.ps1
$ErrorActionPreference = "Stop"

# JSON stdin에서 데이터 읽기
$inputJson = [Console]::In.ReadToEnd()
$json = $inputJson | ConvertFrom-Json

# 디버깅용 로그 (필요 시 주석 해제)
# $inputJson | Out-File -FilePath ".claude/hooks/debug_post_hook.txt" -Append

# 파일 경로 및 도구 이름 추출
$toolName = if ($json.tool_name) { $json.tool_name } else { "Unknown" }
# tool_input 내의 다양한 경로 속성 확인
$filePath = if ($json.tool_input.file_path) { $json.tool_input.file_path }
            elseif ($json.tool_input.path) { $json.tool_input.path }
            else { $null }

# stderr로 로그 출력 (Claude 터미널에는 표시되지 않을 수 있음)
[Console]::Error.WriteLine("🔧 Tool: $toolName")
if ($filePath) { [Console]::Error.WriteLine("📁 File: $filePath") }

# 파일이 존재하고 포맷팅 대상 확장자인지 확인
$validExtensions = @(".ts", ".js", ".tsx", ".jsx", ".json", ".css", ".md")
$shouldFormat = $filePath -and (Test-Path $filePath) -and ($validExtensions -contains [System.IO.Path]::GetExtension($filePath))

if ($shouldFormat) {
    [Console]::Error.WriteLine("📝 포맷팅 시작: $filePath")
    
    # Prettier 실행 우선순위: 로컬 > 전역 > npx
    if (Test-Path "./node_modules/.bin/prettier.cmd") {
        # 로컬 node_modules
        & "./node_modules/.bin/prettier.cmd" --write "$filePath"
        [Console]::Error.WriteLine("✅ $filePath 포맷팅 완료 (local)")
    }
    elseif (Get-Command "prettier" -ErrorAction SilentlyContinue) {
        # 전역 설치
        prettier --write "$filePath"
        [Console]::Error.WriteLine("✅ $filePath 포맷팅 완료 (global)")
    }
    else {
        # npx 사용 (느릴 수 있음)
        npx prettier --write "$filePath"
        [Console]::Error.WriteLine("✅ $filePath 포맷팅 완료 (npx)")
    }
}
else {
    [Console]::Error.WriteLine("ℹ️  포맷팅 건너뜀")
}

# 로그 파일 기록 (선택 사항)
$logMsg = "$(Get-Date): PostToolUse - Tool: $toolName, File: $filePath"
$logMsg | Out-File -FilePath ".claude/hooks/post_hook_log.txt" -Append

exit 0