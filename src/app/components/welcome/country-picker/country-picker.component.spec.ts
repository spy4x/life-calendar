import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeCountryPickerComponent } from './country-picker.component';

describe('WelcomeCountryPickerComponent', () => {
  let component: WelcomeCountryPickerComponent;
  let fixture: ComponentFixture<WelcomeCountryPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeCountryPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeCountryPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
