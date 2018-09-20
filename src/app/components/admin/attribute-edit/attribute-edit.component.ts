import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AttributeService} from "../../../services/attribute/attribute.service";

@Component({
  selector: 'app-attribute-edit',
  templateUrl: './attribute-edit.component.html',
  styleUrls: ['./attribute-edit.component.css']
})
export class AttributeEditComponent implements OnInit{
  @Input('attr') attr: object;
  @Output('editing') editing = new EventEmitter<boolean>();

  request: boolean = true;
  errors = null;
  groups = null;
  addForm = {
    id: 0,
    name: '',
    Group_id: 0
  };

  constructor(private attributes: AttributeService) {}

  ngOnInit() {
    this.attributes.show(this.attr).subscribe(e => {
      if(e['id']){
        this.attributes.allGroups("").subscribe(e => {
          this.groups = e['groups']['data'];
        });
        this.addForm.id = e['id'];
        this.addForm.name = e['name'];
        this.addForm.Group_id = e['Group_id']
      }
      else{
        this.onClose();
      }
    })
  }

  onSubmit() {
    if(this.request){
      this.request = false;
      this.attributes.update(this.addForm.id.toString(),this.addForm.name, this.addForm.Group_id.toString()).subscribe(e => {
        this.request = true;
        if(e['status']){
          this.editing.emit(true);
          this.errors = null;
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
    this.editing.emit(true);
  }
}
