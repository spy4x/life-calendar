import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeAgePickerComponent } from './age-picker.component';

describe('WelcomeAgePickerComponent', () => {
  let component: WelcomeAgePickerComponent;
  let fixture: ComponentFixture<WelcomeAgePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeAgePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeAgePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
