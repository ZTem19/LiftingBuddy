import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalProgressComponent } from './interval-progress.component';

describe('IntervalProgressComponent', () => {
  let component: IntervalProgressComponent;
  let fixture: ComponentFixture<IntervalProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervalProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
