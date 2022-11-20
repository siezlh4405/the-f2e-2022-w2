import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSignComponent } from './service-sign.component';

describe('ServiceSignComponent', () => {
  let component: ServiceSignComponent;
  let fixture: ComponentFixture<ServiceSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
