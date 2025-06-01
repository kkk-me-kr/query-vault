#!/bin/bash

set -e  # 중간에 실패 시 스크립트 종료

export HOME="/home/ubuntu"
export NVM_DIR="$HOME/.nvm"
echo "NVM 로드: $NVM_DIR"
source "$NVM_DIR/nvm.sh"

PROJECT_DIR="$HOME/projects/query-vault"
echo "📁 이동: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo "NVM 사용"
nvm use

echo "📦 의존성 설치..."
npm install

echo "🛠️ 빌드 실행..."
npm run build

echo "🚀 PM2 reload..."
pm2 reload query-vault

echo "✅ 배포 완료!"
