import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeAddComponent } from './attribute-add.component';

describe('AttributeAddComponent', () => {
  let component: AttributeAddComponent;
  let fixture: ComponentFixture<AttributeAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
