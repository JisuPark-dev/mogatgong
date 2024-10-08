import fs from'fs'

// 원본 파일과 결과 파일 경로 설정
const originalFilePath = 'env/.env';
const newFilePath = 'env/.env.build';

// 파일을 읽고 치환한 후 새 파일로 저장하는 함수
fs.readFile(originalFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('파일을 읽는 중 에러 발생:', err);
        return;
    }

    // 각 줄을 처리하여 치환 작업 수행
    let result = data.split('\n').map(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            // 왼쪽의 key만 추출하여 "%%KEY%%"로 치환
            return `${key}="%%${key}%%"`;
        }
        return line;  // 빈 줄이나 잘못된 형식의 줄은 그대로 둠
    }).join('\n');

    // 결과를 새 파일로 저장
    fs.writeFile(newFilePath, result, 'utf8', (err) => {
        if (err) {
            console.error('파일을 저장하는 중 에러 발생:', err);
            return;
        }
        console.log('.env.build 파일이 성공적으로 생성되었습니다.');
    });
});
