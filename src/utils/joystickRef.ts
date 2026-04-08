// 글로벌 조이스틱 상태 — MobileControls에서 쓰고 Player의 useFrame에서 읽음
export interface JoystickState {
  x: number;
  y: number;
  active: boolean;
}

export const joystickState: JoystickState = { x: 0, y: 0, active: false };
