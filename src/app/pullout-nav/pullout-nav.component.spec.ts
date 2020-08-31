import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PulloutNavComponent } from './pullout-nav.component';

describe('PulloutNavComponent', () => {
  let component: PulloutNavComponent;
  let fixture: ComponentFixture<PulloutNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PulloutNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PulloutNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
