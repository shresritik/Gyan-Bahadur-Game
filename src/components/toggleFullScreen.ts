export function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // canvas.requestFullscreen();
    document.body.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
