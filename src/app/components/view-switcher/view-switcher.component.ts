import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { ViewType } from '../../types/view.type';


@Component({
  selector: 'lc-view-switcher',
  templateUrl: './view-switcher.component.jade',
  styleUrls: ['./view-switcher.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewSwitcherComponent {
  @Input() view: ViewType;
  @Output() changed = new EventEmitter<ViewType>();
}
