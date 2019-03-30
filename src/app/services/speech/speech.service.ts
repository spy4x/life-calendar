import { Injectable } from '@angular/core';

const synth = window.speechSynthesis;

@Injectable()
export class SpeechService {

  constructor() {
  }

  async speak(text: string): Promise<void> {
    if (!text) {
      return;
    }
    if (synth.speaking) {
      synth.cancel();
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 4000); // fallback
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => resolve();
        utterance.onerror = error => reject(error);
        utterance.pitch = 1;
        utterance.rate = 1;
        synth.speak(utterance);
      } catch (error) {
        reject(error);
      }
    });
  }
}
