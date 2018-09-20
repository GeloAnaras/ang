import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeGroupsAddComponent } from './attribute-groups-add.component';

describe('AttributeGroupsAddComponent', () => {
  let component: AttributeGroupsAddComponent;
  let fixture: ComponentFixture<AttributeGroupsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeGroupsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeGroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
