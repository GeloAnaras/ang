import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeGroupsEditComponent } from './attribute-groups-edit.component';

describe('AttributeGroupsEditComponent', () => {
  let component: AttributeGroupsEditComponent;
  let fixture: ComponentFixture<AttributeGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeGroupsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
