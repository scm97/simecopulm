import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordCoordComponent } from './record-coord.component';

describe('RecordCoordComponent', () => {
  let component: RecordCoordComponent;
  let fixture: ComponentFixture<RecordCoordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordCoordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordCoordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
