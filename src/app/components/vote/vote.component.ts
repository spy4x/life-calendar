import { ChangeDetectionStrategy, Component,  ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'lc-vote-component',
  templateUrl: './vote.component.pug',
  styleUrls: ['./vote.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteComponent {
  constructor() {}
  vote() {
    window.location.href = 'https://www.angularattack.com/entries/77-asap/vote';
  }
}
