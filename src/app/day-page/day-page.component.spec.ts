import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayPageComponent } from './day-page.component';

describe('DayPageComponent', () => {
  let component: DayPageComponent;
  let fixture: ComponentFixture<DayPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
