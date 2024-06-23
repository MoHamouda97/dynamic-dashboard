import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPreviewPropComponent } from './dash-preview-prop.component';

describe('DashPreviewPropComponent', () => {
  let component: DashPreviewPropComponent;
  let fixture: ComponentFixture<DashPreviewPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashPreviewPropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashPreviewPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
