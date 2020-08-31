import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageExperienceComponent } from './page-experience.component';

describe('PageExperienceComponent', () => {
  let component: PageExperienceComponent;
  let fixture: ComponentFixture<PageExperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageExperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
