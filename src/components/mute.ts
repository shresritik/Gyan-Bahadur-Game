import { audioLevel } from "../constants/constants";
import {
  ammoAudio,
  barkAudio,
  bgmAudio,
  coronaAudio,
  damageAudio,
  eatingAudio,
  explosionAudio,
  fireAudio,
  flagAudio,
  loseAudio,
  runAudio,
  sadAudio,
  waterAudio,
  winAudio,
} from "./audio";

export function muteOption() {
  if (!audioLevel.isMuted) {
    winAudio.muted = true;
    loseAudio.muted = true;
    eatingAudio.muted = true;
    flagAudio.muted = true;
    coronaAudio.muted = true;
    fireAudio.muted = true;
    damageAudio.muted = true;
    waterAudio.muted = true;
    explosionAudio.muted = true;
    barkAudio.muted = true;
    sadAudio.muted = true;
    ammoAudio.muted = true;
    runAudio.muted = true;
    bgmAudio.muted = true;
  } else {
    winAudio.muted = false;
    loseAudio.muted = false;
    eatingAudio.muted = false;
    flagAudio.muted = false;
    coronaAudio.muted = false;
    fireAudio.muted = false;
    damageAudio.muted = false;
    waterAudio.muted = false;
    explosionAudio.muted = false;
    barkAudio.muted = false;
    sadAudio.muted = false;
    bgmAudio.muted = false;
    ammoAudio.muted = false;
    runAudio.muted = false;
  }
  audioLevel.isMuted = !audioLevel.isMuted;
}
