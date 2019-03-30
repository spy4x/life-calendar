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
      throw new Error('Speaking now');
    }
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => resolve();
      utterance.onerror = error => reject(error);
      utterance.pitch = 1;
      utterance.rate = 1;
      synth.speak(utterance);
      resolve();
    });
  }
}
