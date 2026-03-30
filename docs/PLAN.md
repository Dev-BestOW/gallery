# 3D Gallery Portfolio - Implementation Plan

## Space Layout

```
              ┌─────────────────────┐
              │    ★ Entrance Hall   │
              │   (Intro / Welcome)  │
              └────────┬────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐  ┌─────▼─────┐ ┌────▼────┐
    │  Wing A  │  │  Wing B   │ │ Wing C  │
    │ About Me │  │ Projects  │ │ Career  │
    └─────────┘  └───────────┘ └─────────┘
                       │
              ┌────────▼────────────┐
              │      Wing D         │
              │  Contact / Links    │
              └─────────────────────┘
```

## Section Details

### Entrance Hall
- 대형 타이포그래피로 이름 + 직함
- 스포트라이트 연출
- 입장 시 카메라 페이드인 애니메이션

### Wing A - About Me
- 벽면 1: 프로필 사진 (대형 액자)
- 벽면 2: 소개글 (텍스트 플레이트)
- 벽면 3: 스킬셋 (아이콘/차트 형태)
- 조명: 따뜻한 톤 (warm white)

### Wing B - Projects
- 각 프로젝트를 독립 액자로 전시
- 액자: 스크린샷 이미지
- 플레이트: 프로젝트명, 기간, 기술스택, 설명
- 클릭 시: 상세 패널 + 외부 링크
- 조명: 프로젝트별 다른 스포트라이트 색상

### Wing C - Career
- 타임라인 형태로 벽면 배치 (연대순)
- 각 경력: 회사 로고/이미지 + 직함 + 기간 + 설명
- 동선이 자연스럽게 과거→현재 흐름

### Wing D - Contact
- 라운지 분위기 (소파 오브젝트 등)
- SNS 링크 (GitHub, LinkedIn, Email 등)
- 방명록 느낌의 인터랙션 (선택)

## Interaction Design

| 입력 | 동작 |
|------|------|
| WASD / 방향키 | 걷기 이동 |
| 마우스 드래그 | 시점 회전 |
| 작품 2m 이내 접근 | "E키로 감상" 힌트 표시 |
| E키 또는 클릭 | 카메라 → 작품 정면 이동 + 상세 패널 |
| ESC | 상세 패널 닫기, 자유 이동 복귀 |
| 모바일 터치 | 가상 조이스틱 + 터치 감상 |

## Data Structure

```typescript
interface Artwork {
  id: string;
  title: string;
  image: string;
  description: string;
  tags: string[];
  link?: string;
  period?: string;
}

interface Wing {
  id: string;
  name: string;
  theme: 'grand' | 'warm' | 'cool' | 'dark' | 'cozy';
  artworks: Artwork[];
}
```

## Component Specifications

### Room
- Props: `position`, `size: [width, height, depth]`, `doorways: Direction[]`
- 자동으로 벽, 바닥, 천장 메시 생성
- doorways 방향에는 벽 대신 통로 생성
- rapier collider 자동 부착

### ArtFrame
- Props: `artwork: Artwork`, `position`, `rotation`, `size`
- 나무 프레임 메시 + 이미지 텍스처
- 하단에 InfoPlate 자동 배치
- 스포트라이트 자동 배치 (위에서 아래로)

### Player
- 1인칭 카메라 + capsule collider
- PointerLockControls 기반
- 이동 속도: 3m/s, 높이: 1.7m

### ArtworkDetail (UI Overlay)
- 작품 감상 모드 시 표시
- 이미지 확대 + 제목/설명/태그/링크
- 반투명 배경 오버레이

## Implementation Phases

### Phase 1: Foundation (MVP) ✅
- [x] Plan 작성
- [x] Vite + React + TypeScript 프로젝트 초기화
- [x] Three.js / R3F / drei / rapier 설치
- [x] 단일 Room 컴포넌트 (벽, 바닥, 천장)
- [x] Player 컴포넌트 (1인칭 이동 + 벽 충돌)
- [x] 기본 조명 (ambient + directional)
- [x] 포인터 락 + WASD 이동 동작 확인

### Phase 2: Artwork System
- [ ] ArtFrame 컴포넌트 (액자 + 이미지 + 플레이트)
- [ ] useProximity 훅 (작품 근접 감지)
- [ ] ArtworkDetail 오버레이 (상세 패널)
- [ ] 카메라 작품 포커스 애니메이션
- [ ] portfolio.ts 데이터 구조 + 샘플 데이터

### Phase 3: Multi-Room Gallery
- [ ] 다중 Room 배치 + Doorway 연결
- [ ] 섹션별 데이터 바인딩 (Wing → Room → ArtFrame)
- [ ] 섹션별 조명 테마 적용
- [ ] Entrance Hall 대형 타이포
- [ ] 바닥 안내선 또는 화살표

### Phase 4: Polish
- [ ] 바닥 반사 효과 (MeshReflectorMaterial)
- [ ] 스포트라이트 연출 강화
- [ ] 로딩 화면 (WelcomeScreen)
- [ ] 페이드인/아웃 전환 효과
- [ ] 텍스처 적용 (벽: 흰벽, 바닥: 대리석/나무)

### Phase 5: Mobile & UX
- [ ] 모바일 감지 + 가상 조이스틱
- [ ] 터치 기반 작품 감상
- [ ] 미니맵 HUD
- [ ] 반응형 상세 패널

### Phase 6: Extra (Optional)
- [ ] 발자국 사운드 효과
- [ ] 배경 음악 (ambient)
- [ ] URL 딥링크 (섹션별)
- [ ] 방명록 기능
- [ ] 파티클 이펙트 (엔트런스)
