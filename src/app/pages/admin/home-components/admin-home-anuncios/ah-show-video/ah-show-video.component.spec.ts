import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhShowVideoComponent } from './ah-show-video.component';

describe('AhShowVideoComponent', () => {
  let component: AhShowVideoComponent;
  let fixture: ComponentFixture<AhShowVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AhShowVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AhShowVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
