import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AttributeService} from "../../../services/attribute/attribute.service";

@Component({
  selector: 'app-attribute-groups-edit',
  templateUrl: './attribute-groups-edit.component.html',
  styleUrls: ['./attribute-groups-edit.component.css']
})
export class AttributeGroupsEditComponent implements OnInit {
  @Input('prodId') prodId;
  @Output('editing') editing = new EventEmitter<boolean>();

  request: boolean = true;
  addForm = {
    id: 0,
    name: '',
  };
  errors = null;
  constructor(private attributes: AttributeService) { }

  ngOnInit() {
    this.attributes.showGroup(this.prodId).subscribe(e => {
      if(e['id']){
        this.addForm.id = e['id'];
        this.addForm.name = e['name'];
      }
      else{
        this.onClose();
      }
    })
  }

  onSubmit(){
    if(this.request){
      this.request = false;
      this.attributes.updateGroups(this.addForm.id.toString(),this.addForm.name).subscribe(e => {
        this.request = true;
        if(e['status']){
          this.errors = null;
          this.onClose();
        }
        if(e['statusText'] === 'To many requests'){
          this.errors = e;
        }
        else{
          this.errors = e;
        }
      },error => this.errors = {'error':error.error.message})
    }

  }
  onClose(){
    this.editing.emit(false);
  }

}
