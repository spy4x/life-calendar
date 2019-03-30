import {
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  OnInit, Output,
  ViewEncapsulation
} from '@angular/core';
import {ViewType} from '../../types/view.type';


@Component({
  selector: 'lc-view-switcher',
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSwitcherComponent implements OnInit {
  @Input() view: ViewType;
  @Output() changed = new EventEmitter<ViewType>();

  constructor() {
  }

  ngOnInit() {
  }

}
