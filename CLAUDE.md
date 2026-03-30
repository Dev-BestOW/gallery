# 3D Gallery Portfolio

## Project Overview
1인칭 시점으로 미술관을 걸어 다니며 벽에 걸린 "작품" 형태로 이력/프로젝트를 감상하는 인터랙티브 3D 포트폴리오.

## Tech Stack
- **Framework**: React + TypeScript + Vite
- **3D Engine**: Three.js + React Three Fiber (@react-three/fiber)
- **Helpers**: @react-three/drei (controls, text, image, environment)
- **Physics**: @react-three/rapier (wall collision)
- **State**: Zustand
- **Routing**: react-router-dom
- **Deploy**: Vercel

## Project Structure
```
src/
├── components/
│   ├── canvas/        # 3D components (Gallery, Room, Wall, Floor, ArtFrame, Player, etc.)
│   └── ui/            # 2D overlay (HUD, ArtworkDetail, WelcomeScreen, MobileControls)
├── data/
│   └── portfolio.ts   # Wing/Artwork data
├── hooks/             # usePlayerControls, useProximity
├── stores/            # useGalleryStore (Zustand)
├── constants/         # Layout dimensions, positions
└── assets/            # textures/, images/
```

## Architecture Decisions
- Room은 재사용 가능한 컴포넌트로, position/size/doorways를 props로 받아 생성
- 작품 데이터는 `data/portfolio.ts`에서 중앙 관리 (Wing > Artwork 계층)
- 3D 씬 내 UI는 drei의 Html 컴포넌트, 풀스크린 오버레이는 HTML/CSS
- 작품 근접 감지 (2m) → 힌트 표시 → 클릭 시 카메라 이동 + 상세 패널

## Gallery Layout
- **Entrance Hall**: 인트로, 이름 + 한 줄 소개
- **Wing A (About)**: 프로필, 소개글, 스킬셋
- **Wing B (Projects)**: 프로젝트별 스크린샷 + 설명
- **Wing C (Career)**: 경력/학력 타임라인
- **Wing D (Contact)**: 연락처, SNS 링크

## Conventions
- 컴포넌트 파일명: PascalCase (.tsx)
- 훅 파일명: camelCase (.ts), use 접두사
- 3D 단위: 1 unit = 1 meter
- 데이터 타입은 `data/portfolio.ts`에 인터페이스와 함께 정의
- 상세 구현 계획: `docs/PLAN.md` 참조
