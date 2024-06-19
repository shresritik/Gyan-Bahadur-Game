import { canvas } from "./canvas";

export function toggleFullScreen() {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
