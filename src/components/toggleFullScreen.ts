export function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}
