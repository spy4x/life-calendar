import { Injectable } from '@angular/core';
import { UserDataService } from '../user-data/user-data.service';

const synth = window.speechSynthesis;
const responsiveVoice = (window as any).responsiveVoice;

@Injectable()
export class SpeechService {
  private voices: SpeechSynthesisVoice[];
  private voice: SpeechSynthesisVoice;

  constructor(private userData: UserDataService) {}

  getVoice() {
    if (!this.voice) {
      this.voices = synth.getVoices().filter(v => v.lang.startsWith('en'));
      const danielVoice = this.voices.find(v => (v.voiceURI.toLowerCase().indexOf('daniel') >= 0) && v.lang === 'en-GB');
      this.voice = danielVoice || this.voices[0];
    }
    return this.voice;
  }

  async speak(text: string): Promise<void> {
    if (!text || !this.userData.user$.value.shouldPlayVoice) {
      return;
    }
    if (synth.speaking) {
      synth.cancel();
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 5000); // fallback, because sometimes bug happens - "onend" is not called at all
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en';
        utterance.onend = () => resolve();
        utterance.onerror = error => reject(error);
        utterance.pitch = 1;
        utterance.rate = 1.05;
        utterance.voice = this.getVoice();
        synth.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }
}
