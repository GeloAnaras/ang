import { Component, OnInit } from '@angular/core';
import {AttributeService} from "../../../services/attribute/attribute.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-attribute-groups',
  templateUrl: './attribute-groups.component.html',
  styleUrls: ['./attribute-groups.component.css']
})
export class AttributeGroupsComponent implements OnInit {
  request: boolean = true;
  errors = null;
  groups = null;
  addMode = false;
  editMode = false;
  params: Params = {
    order: 'id',
    direction: 'ASC',
    page: 1
  };
  colums = [
    {name: "id",value: "номер"},
    {name: "name",value: "наименование"}
  ];
  paginationData = null;

  constructor(private attributes: AttributeService, private aR:ActivatedRoute, ) {

    aR.params.subscribe(e => {
      if(e['page']){
        this.params.order = e['order'];
        this.params.direction = e['direction'];
        this.params.page = e['page'];
        this.updateGroups();
      }
      else{
        this.params.order = 'id';
        this.params.direction = 'ASC';
        this.params.page = 1;
        if(aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateGroups();
      }
    });
  }

  ngOnInit() {
  }
  prepareParams(){
    let queryParams ="?";
    for(let key in this.params){
      queryParams += key + "=" + this.params[key] + "&"
    }
    return queryParams;
  }

  updateGroups(){
    if(this.request){
      this.request = false;
      this.attributes.allGroups(this.prepareParams()).subscribe(e => {
        this.request = true;
        if(e['groups']){
          this.groups= e['groups']['data'];
          this.paginationData = {
            current: e['groups'].current_page,
            last: e['groups'].last_page,
            previous: e['groups'].prev_page_url ? e['groups'].prev_page_url.split('=')[1] : e['groups'].prev_page_url,
            next: e['groups'].next_page_url ? e['groups'].next_page_url.split('=')[1] : e['groups'].next_page_url,
            order: this.params.order,
            direction: this.params.direction
          }
        }
        if(e['statusText'] === 'To many requests') {
          this.errors = e;
        }
        else{
          this.errors = e;
        }
      },error => this.errors = {'error':error.error.message})
    }
  }

  onDelete(id) {
    this.attributes.delGroup(id).subscribe(e =>{
      if(e['status']){
        this.updateGroups();
        this.errors = null;
      }
      else{
        this.errors = e;
      }
    })
  }

}
