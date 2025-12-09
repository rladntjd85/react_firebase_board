🚀 React 학습 기반 게시판 프로젝트

React를 제대로 이해하고 실무 감각을 익히기 위해 처음부터 끝까지 직접 구현한 학습/연습 프로젝트입니다.
컴포넌트 구조, 상태 관리, 라우팅, 인증, 실시간 데이터 처리, 배포까지 React 기반 웹앱의 전체 흐름을 경험하며 실제 서비스처럼 동작하도록 구성했습니다.

🔗 Links

URL: https://todo-first-1e981.web.app/

🌐 운영환경

Firebase Hosting 무중단 배포
Firebase Authentication 사용자 인증
Firestore 실시간 데이터베이스
Cloudinary 이미지 스토리지 연동
Vite 기반 개발환경 구성

🔄 주요 기능
🟦 사용자 기능

회원가입, 로그인/로그아웃 (Firebase Auth)

게시글 작성/조회/수정/삭제

게시글 검색 기능

상세 페이지 및 실시간 데이터 반영

Cloudinary 이미지 업로드 + 파일 검증(확장자/용량)

🟩 게시판 엔진

Firestore 실시간 onSnapshot 기반 목록 자동 업데이트

본인 게시글만 수정/삭제 가능하도록 권한 제어

Firestore Rules 기반 보안 정책 설계

이미지·텍스트 혼합 게시물 구조 구현

🛡 보안 및 데이터 검증

Firestore Rules로 인증, 글 소유자 검증, 필드 타입/길이 제한 적용

이미지 업로드 시 MIME 타입·파일 크기 프론트단 검증

서버 시간을 기준으로 데이터 정합성 유지

📊 주요 성과

React의 렌더링 구조, 상태관리 흐름, Router 동작 원리 실전 습득

Firebase 전반(Auth·Firestore·Rules·Hosting) 운영 경험 확보

외부 스토리지(Cloudinary)와의 연동을 통한 파일 업로드 구조 이해

단순 기능 구현을 넘어 서비스 전체 흐름(인증 → CRUD → Storage → 배포) 을 경험

🛠 기술 스택
Front-end

React · Vite · React Router
HTML · CSS · JavaScript

Backend / BaaS

Firebase Authentication
Firestore (Realtime Query)
Cloudinary Image API

Infra / Tools

Firebase Hosting
VSCode · Git · GitHub

⚙ 전체 구조

Client (React)
↓
Firebase Authentication
↓
Firestore (게시글/사용자 저장)
↓
Cloudinary (이미지 저장)
↓
Firebase Hosting (정적 웹 배포)