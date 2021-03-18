import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Warikan030Component } from './warikan030.component';

describe('Warikan030Component', () => {
  let component: Warikan030Component;
  let fixture: ComponentFixture<Warikan030Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Warikan030Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Warikan030Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
