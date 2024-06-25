export interface IBase {
  position: { x: number; y: number };
  h: number;
  w: number;
  bulletY?: number;
}
export interface TKeys {
  [keys: string]: boolean;
}
