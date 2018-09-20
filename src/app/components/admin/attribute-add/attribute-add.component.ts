import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AttributeService} from "../../../services/attribute/attribute.service";

@Component({
  selector: 'app-attribute-add',
  templateUrl: './attribute-add.component.html',
  styleUrls: ['./attribute-add.component.css']
})
export class AttributeAddComponent implements OnInit {
  @Output('adding') adding = new EventEmitter<boolean>();

  request: boolean = true;
  groups = null;
  newAttr = {
    name: "",
    group: 1
  };
  errors = null;

  constructor(private attributes: AttributeService) {
    attributes.allGroups("").subscribe(e => {
      this.groups = e['groups']['data'];

    })
  }

  ngOnInit() {
  }
  onSubmit(){
    if(this.request){
      this.request = false;
      this.attributes.add(this.newAttr.name, this.newAttr.group.toString()).subscribe(e => {
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
    this.adding.emit(true);
  }
}
