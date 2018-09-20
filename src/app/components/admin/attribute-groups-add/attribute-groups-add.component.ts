import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AttributeService} from "../../../services/attribute/attribute.service";

@Component({
  selector: 'app-attribute-groups-add',
  templateUrl: './attribute-groups-add.component.html',
  styleUrls: ['./attribute-groups-add.component.css']
})
export class AttributeGroupsAddComponent implements OnInit {
  @Output('adding') adding = new EventEmitter<boolean>();

  request: boolean = true;
  addForm = {
    name: '',
  };
  errors = null;

  constructor(private attributes: AttributeService) { }

  ngOnInit() {
  }

  onSubmit() {
    if(this.request){
      this.request = false;
      this.attributes.addGroup(this.addForm.name).subscribe(e => {
        this.request = true;
        if(e['status']){
          this.adding.emit(true);
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
    this.adding.emit(false);
  }
}
