export async function getScaledDisplayMedia(): Promise<MediaStream> {
  const width = Math.floor(window.screen.width * 0.25);
  const height = Math.floor(window.screen.height * 0.25);
  return navigator.mediaDevices.getDisplayMedia({
    video: { width, height },
    audio: false,
  });
}