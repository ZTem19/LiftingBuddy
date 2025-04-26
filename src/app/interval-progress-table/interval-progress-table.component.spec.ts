import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalProgressTableComponent } from './interval-progress-table.component';

describe('IntervalProgressTableComponent', () => {
  let component: IntervalProgressTableComponent;
  let fixture: ComponentFixture<IntervalProgressTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntervalProgressTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntervalProgressTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
