const fs = require('fs');
const path = require('path');

// 로그 파일 경로
const LOG_FILE = path.join(__dirname, '..', '..', 'hook_execution.log');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    try {
        fs.appendFileSync(LOG_FILE, logMessage);
    } catch (e) {
        // 로깅 실패는 무시
    }
}

// 훅 실행 로깅 (항상 출력)
console.error('🚀 디스패처 실행됨!');
log('🚀 디스패처 시작');

try {
    // Claude가 stdin을 통해 전달한 JSON 데이터를 읽습니다.
    const input = fs.readFileSync(0, 'utf8');
    log(`📥 입력 데이터 수신: ${input.substring(0, 200)}...`);
    
    const data = JSON.parse(input);

    const toolName = data.tool_name;
    // 파일 경로는 tool_input 객체 안에 다양한 형태로 존재할 수 있어, 순차적으로 확인합니다.
    let rawFilePath = data.tool_input.path || data.tool_input.file_path || (data.tool_input.args && data.tool_input.args[0]) || '';
    
    // [핵심] Windows 경로를 슬래시로 정규화
    const filePath = rawFilePath.replace(/\\/g, '/');

    console.error(`🔧 Tool: ${toolName}, 📁 File: ${filePath}`);
    log(`🔧 Tool: ${toolName}, 📁 File: ${filePath}`);

    // 파일 경로가 없으면 스킵 (Bash 등의 도구)
    if (!filePath) {
        console.error("ℹ️  파일 경로 없음, 검사 스킵");
        log("ℹ️  파일 경로 없음, 검사 스킵");
        process.exit(0);
    }

    // ===== 기존 보안 규칙들 (그대로 유지) =====
    
    // 규칙 1: .env 파일 접근 제어
    if (filePath.toLowerCase().includes('.env')) {
        if (toolName === 'Read' || toolName === 'Grep') {
            const msg = "❌ 보안 규칙 위반: .env 파일은 읽을 수 없습니다. 작업이 차단되었습니다.";
            console.error(msg);
            log(msg);
            process.exit(2);
        }
    }

    // 규칙 2: 마이그레이션 파일 수정 제어
    if (filePath.includes('src/db/migrations/')) {
        if (toolName === 'Edit' || toolName === 'Write' || toolName === 'MultiEdit') {
            const msg = "❌ 데이터 불변성 규칙 위반: 마이그레이션 파일은 수정할 수 없습니다. 새 마이그레이션 파일을 생성하세요. 작업이 차단되었습니다.";
            console.error(msg);
            log(msg);
            process.exit(2);
        }
    }

    // 규칙 3: 서비스 파일 문서화 정책
    if (filePath.includes('src/services/')) {
        if (toolName === 'Create' || toolName === 'Edit' || toolName === 'Write') {
            const content = data.tool_input.content || '';
            if (!content.includes('@author')) {
                const msg = "❌ 문서화 규칙 위반: 서비스 파일에는 반드시 '@author' JSDoc 태그가 포함되어야 합니다. 작업이 차단되었습니다.";
                console.error(msg);
                log(msg);
                process.exit(2);
            }
        }
    }

    // ===== 아키텍트 멘토 규칙들 =====
    
    // 멘토 규칙 1: 라우터 파일 수정 시 멘토링
    if (filePath.includes('/routes/') && (toolName === 'Edit' || toolName === 'Create' || toolName === 'Write')) {
        const fileName = filePath.split('/').pop() || '';
        const entityName = fileName.replace(/Routes?\.(js|ts)$/i, '').toLowerCase();
        
        // 상세한 멘토 메시지 출력
        console.error('');
        console.error('🎯 [라우터 수정 감지] user API 라우터를 수정하려고 합니다.');
        console.error('');
        console.error('🏗️ 아키텍트 멘토의 조언:');
        console.error('');
        console.error('   라우터를 수정하기 전에 다음 파일들을 먼저 확인하세요:');
        console.error('');
        console.error(`   📄 src/models/${entityName}.js - 데이터 모델 구조`);
        console.error(`   📄 src/services/${entityName}Service.js - 비즈니스 로직`);
        console.error(`   📄 src/controllers/${entityName}Controller.js - 컨트롤러 패턴`);
        console.error('');
        console.error('💡 권장 순서:');
        console.error('');
        console.error('   1. 관련 모델 구조 파악');
        console.error('   2. 서비스 계층 로직 확인');
        console.error('   3. 기존 API 패턴 분석');
        console.error('   4. 일관된 라우터 설계');
        console.error('');
        console.error('작업을 다시 계획해주세요! 🚀');
        console.error('');
        
        log(`🎯 라우터 수정 감지: ${filePath}`);
        process.exit(2);
    }

    // 멘토 규칙 2: 모델 파일 수정 시 영향도 경고
    if (filePath.includes('/models/') && (toolName === 'Edit' || toolName === 'Write')) {
        console.error(`🗃️ [모델 수정 경고] 데이터 모델 변경은 신중해야 합니다!`);
        console.error(`📋 체크리스트: □ 기존 데이터 호환성 □ API 응답 변경 □ 마이그레이션 필요성`);
        console.error(`영향도를 분석한 후 계획을 세워주세요.`);
        log(`🗃️ 모델 수정 경고: ${filePath}`);
        process.exit(2);
    }

    // 위의 모든 규칙에 해당하지 않으면 작업을 허용합니다.
    console.error("✅ 모든 규칙 통과");
    log("✅ 모든 규칙 통과");
    process.exit(0);

} catch (error) {
    const errorMsg = `❌ 디스패처 오류: ${error.message}`;
    console.error(errorMsg);
    log(errorMsg);
    process.exit(0);
}