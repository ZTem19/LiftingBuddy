import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalStatsPageComponent } from './interval-stats-page.component';

describe('IntervalStatsPageComponent', () => {
  let component: IntervalStatsPageComponent;
  let fixture: ComponentFixture<IntervalStatsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervalStatsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalStatsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
