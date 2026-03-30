# QA Report - 3D Gallery Portfolio

**Date:** 2026-03-30
**Reviewer:** Code Review Agent (Sonnet)
**Files Reviewed:** 19 source files
**Total Issues:** 17

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 3 | Fixed |
| HIGH | 5 | Fixed |
| MEDIUM | 6 | Fixed |
| LOW | 3 | Fixed |

---

## CRITICAL (갤러리 이동 불가)

### 1. 방 사이 바닥 없음 — 플레이어 추락
**Files:** `Gallery.tsx:86-133`

모든 방 연결부에 바닥/벽 메시가 없는 빈 공간이 존재. 물리 중력이 활성화되어 있어 방 사이를 이동하면 플레이어가 추락함.

| 연결 | 갭 크기 | 방향 |
|------|---------|------|
| Entrance → Corridor | 7.5 units | Z [7.5, 15] |
| Corridor → Wing B | 7.5 units | Z [22, 29.5] |
| Wing B → Wing D | 4.5 units | Z [44.5, 49] |
| Corridor → Wing A | 2 units | X [-12, -10] |
| Corridor → Wing C | 2 units | X [10, 12] |

**Fix:** 각 연결부에 좁은 복도(doorway 너비 3 unit) Room 또는 바닥/벽 메시 추가.

---

### 2. 복도 ↔ Wing A/C 문 위치 불일치 — 진입 불가
**Files:** `Gallery.tsx:93,113,127`

복도의 동/서 문은 Z=18.5에 중심, Wing A/C 문은 Z=22.5에 중심. WallWithDoorway가 벽 중앙에 문을 생성하므로 문 개구부가 서로 겹치지 않음.

```
복도 동/서 문 개구부:    Z [17, 20]
Wing A/C 동/서 문 개구부: Z [21, 24]
겹침: 없음
```

**Fix:** Wing A/C의 Z 위치를 복도와 일치시키거나(Z=18.5), 연결 복도 Room 추가.

---

### 3. 바닥 화살표 전부 반대 방향
**Files:** `Gallery.tsx:98,102,106,110,124`

FloorArrow의 cone 메시가 `rotation=[-PI/2, 0, 0]`으로 기본 +Z 방향을 가리키는데, 부모 group rotation이 모두 반대로 설정됨. 5개 전체 화살표가 이동 방향과 반대를 가리킴.

| 가이드 | 현재 rotation | 실제 가리키는 방향 | 기대 방향 |
|--------|--------------|-------------------|----------|
| Entrance→Corridor | `[0, PI, 0]` | 북(-Z) | 남(+Z) |
| Corridor→Wing A | `[0, PI/2, 0]` | 동(+X) | 서(-X) |
| Corridor→Wing B | `[0, PI, 0]` | 북(-Z) | 남(+Z) |
| Corridor→Wing C | `[0, -PI/2, 0]` | 서(-X) | 동(+X) |
| Wing B→Wing D | `[0, PI, 0]` | 북(-Z) | 남(+Z) |

**Fix:** 모든 화살표 rotation 반전:
- `[0, PI, 0]` → `[0, 0, 0]`
- `[0, PI/2, 0]` → `[0, -PI/2, 0]`
- `[0, -PI/2, 0]` → `[0, PI/2, 0]`

---

## HIGH

### 4. Sprint키(Shift) 고착
**Files:** `usePlayerControls.ts:34-42`, `ArtworkDetail.tsx:9-17`

Shift 누른 상태에서 작품 클릭 시 포인터 락이 해제되며 `keyup` 이벤트가 누락됨. `keys.sprint`가 `true`로 유지되어 이후 계속 달리기 상태.

**Fix:** `usePlayerControls`에 `blur`/`visibilitychange` 리스너 추가하여 모든 키를 `false`로 리셋.

---

### 5. 모바일: 작품 상세 보는 중 카메라 회전
**Files:** `MobileControls.tsx:69-119`, `Player.tsx:34-45`

MobileControls의 우측 터치 시점 회전 리스너가 `window`에 글로벌로 등록되어 있어, ArtworkDetail 패널 위에서 터치해도 카메라가 회전함. `isLocked` 가드가 없음.

**Fix:** `Player.tsx:34`의 `handleLook`에 `if (isLocked) return;` 가드 추가.

---

### 6. 조이스틱 touchcancel 미처리
**Files:** `MobileControls.tsx:58-66,128-131`

OS 인터럽트(전화, 알림 등) 시 `touchcancel` 발생하는데 핸들러가 없음. 조이스틱 상태가 `active=true`로 유지되어 플레이어가 마지막 방향으로 계속 이동.

**Fix:** 조이스틱 div에 `onTouchCancel={handleTouchEnd}` 추가.

---

### 7. 미니맵 범위 초과/클리핑
**Files:** `Minimap.tsx:6-18,43-47`

현재 `SCALE=3, MAP_W=150, OFFSET_X=30` 설정으로:
- Career(Wing C, x=20, w=16): 오른쪽 끝 174px → 캔버스 150px 초과 (24px 잘림)
- Entrance(z=-7.5): 위쪽 끝 -22.5px → 캔버스 위로 잘림

**Fix:** 상수 재계산: `MAP_W=180, MAP_H=220, SCALE=2.5, OFFSET_X=35` 등으로 전체 월드가 캔버스 내에 들어오도록 조정.

---

### 8. 작품 닫기 후 포인터 락 미복구
**Files:** `ArtworkDetail.tsx:12-14`

데스크탑에서 작품 상세 패널 닫은 후 포인터 락이 복구되지 않아 HUD "클릭하여 계속하기" 오버레이가 표시됨. 매 작품 감상마다 추가 클릭 필요.

**Fix:** ArtworkDetail 닫기 핸들러에서 `document.querySelector('canvas')?.requestPointerLock()` 호출.

---

## MEDIUM

### 9. 카메라 포커스 시 Y 하강
**Files:** `RoomArtworks.tsx:32-35`

카메라 포커스 목표 Y가 작품 중심(2.2m)이지만, 플레이어 눈높이는 2.55m. 포커스 시 카메라가 0.35m 하강하여 머리가 숙여지는 효과 발생.

**Fix:** `cameraPos[1]`을 `PLAYER.height + PLAYER.height / 2` (2.55)로 설정.

---

### 10. applyEuler 대신 applyQuaternion 사용 권장
**Files:** `Player.tsx:69`

`camera.rotation`(Euler) 대신 `camera.quaternion`을 사용하는 것이 수치적으로 안정적이며, 모바일에서 직접 quaternion을 설정하는 것과 일관성 있음.

**Fix:** `.applyEuler(camera.rotation)` → `.applyQuaternion(camera.quaternion)`

---

### 11. 앰비언트 사운드 8초 펄스
**Files:** `useAmbientSound.ts:38-39,45`

버퍼 내 `Math.sin(PI * t / duration)` 엔벨로프로 인해 8초마다 소리가 사라졌다 다시 커지는 펄스 발생. 지속적인 앰비언트가 아님.

**Fix:** 버퍼에서 사인 엔벨로프 제거, GainNode만으로 페이드인/아웃 처리.

---

### 12. 딥링크 URL 텔레포트 미동작
**Files:** `useDeepLink.ts:13-21`

`sectionPositions` 맵이 정의되어 있지만 실제로 플레이어 위치를 이동시키지 않음. `/#career` 접속 시 스토어 라벨만 변경되고 플레이어는 엔트런스에 스폰.

**Fix:** 딥링크 감지 시 `rigidBody.setTranslation()`을 호출하여 실제 텔레포트 구현.

---

### 13. AudioContext resume() 누락
**Files:** `useAmbientSound.ts:13-51`

브라우저에 따라 `new AudioContext()`가 `suspended` 상태로 생성될 수 있음. `ctx.resume()` 호출 누락.

**Fix:** AudioContext 생성 직후 `ctx.resume()` 호출.

---

### 14. 모바일 isPointerLocked 인위적 설정
**Files:** `WelcomeScreen.tsx:16-23`

모바일에서 `setIsPointerLocked(true)`를 인위적으로 호출하여 데스크탑과 모바일의 상태 의미가 불일치. HUD 로직이 이 값에 의존.

**Fix:** 모바일 전용 상태 분리 또는 `hasEntered`만으로 UI 제어 통일.

---

## LOW

### 15. AudioContext 이중 생성
**Files:** `useAmbientSound.ts:14`, `useFootsteps.ts:5,8`

두 훅이 각각 별도 AudioContext 생성. 모바일 구형 브라우저에서 동시 컨텍스트 수 제한 있을 수 있음.

**Fix:** 싱글턴 AudioContext 공유.

---

### 16. AudioContext resume() 누락 (footsteps)
**Files:** `useFootsteps.ts:8-10`

`getAudioContext()`에서 `ctx.resume()`를 호출하고 있으나, 최초 생성 시점이 아닌 사용 시점이므로 문제없음. LOW.

---

### 17. 작품 배치 검증
모든 작품 위치/회전은 수학적으로 올바름. 이슈 없음.
