import { Component, EventEmitter, Output } from '@angular/core';
import { UserDataService } from '../../../services/user-data/user-data.service';

@Component({
  selector: 'lc-welcome',
  templateUrl: './welcome.component.pug',
  styleUrls: ['./welcome.component.sass'],
})
export class WelcomeComponent {
  @Output() done = new EventEmitter<void>();
  user$ = this.userData.user$;
  isFirstStepPassed = false;

  constructor(private userData: UserDataService) {}

  closeWelcome(): void {
    this.isFirstStepPassed = true;
  }
}
