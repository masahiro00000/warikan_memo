import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Warikan010Component } from './warikan010.component';

describe('Warikan010Component', () => {
  let component: Warikan010Component;
  let fixture: ComponentFixture<Warikan010Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Warikan010Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Warikan010Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
