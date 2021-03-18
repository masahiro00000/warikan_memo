import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Warikan000Component } from './warikan000.component';

describe('Warikan000Component', () => {
  let component: Warikan000Component;
  let fixture: ComponentFixture<Warikan000Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Warikan000Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Warikan000Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
