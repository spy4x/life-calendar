import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SpeechService } from '../../../services/speech/speech.service';

@Component({
  selector: 'lc-welcome-age-picker',
  templateUrl: './age-picker.component.pug',
  styleUrls: ['./age-picker.component.sass'],
})
export class WelcomeAgePickerComponent implements OnInit {
  @Output() done = new EventEmitter<void>();

  constructor(private speech: SpeechService) { }

  async ngOnInit() {
    await this.speech.speak(`Let me look at your face to understand your age`);
  }

}
