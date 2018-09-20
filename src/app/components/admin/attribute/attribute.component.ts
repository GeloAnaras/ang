import { Component, OnInit } from '@angular/core';
import {AttributeService} from "../../../services/attribute/attribute.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {
  request: boolean = true;
  errors = null;
  attributesArray = null;
  addMode = false;
  editMode = 0;
  params: Params = {
    order: 'id',
    direction: 'ASC',
    page: 1
  };
  colums = [
    {name: "id", value: "номер"},
    {name: "name", value: "наименование"},
    {name: "Group_id", value: "группа"},
  ];
  paginationData = null;

  constructor(private attributes: AttributeService, private aR: ActivatedRoute) {
    aR.params.subscribe(e => {
      if (e['page']) {
        this.params.order = e['order'];
        this.params.direction = e['direction'];
        this.params.page = e['page'];
        this.updateAttributes();
      }
      else {
        this.params.order = 'id';
        this.params.direction = 'ASC';
        this.params.page = 1;
        if (aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateAttributes();
      }
    });
  }

  ngOnInit() {
  }

  updateAttributes() {
    if (this.request) {
      this.request = false;
      this.attributes.all(this.prepareParams()).subscribe(e => {
        this.request = true;
        if (e['attributes']) {
          this.attributesArray = e['attributes']['data'];
          this.paginationData = {
            current: e['attributes'].current_page,
            last: e['attributes'].last_page,
            previous: e['attributes'].prev_page_url ? e['attributes'].prev_page_url.split('=')[1] : e['attributes'].prev_page_url,
            next: e['attributes'].next_page_url ? e['attributes'].next_page_url.split('=')[1] : e['attributes'].next_page_url,
            order: this.params.order,
            direction: this.params.direction
          }
        }
        if (e['statusText'] === 'To many requests') {
          this.errors = e;
        }
        else {
          this.errors = e;
        }
      }, error => this.errors = {'error': error.error.message})
    }
  }

  prepareParams() {
    let queryParams = "?";
    for (let key in this.params) {
      queryParams += key + "=" + this.params[key] + "&"
    }
    return queryParams;
  }


  editing(attr) {
    this.addMode = false;
    if (this.editMode === attr.id) {
      this.editMode = 0;
    }
    else {
      this.editMode = attr.id;
      this.attributes.editeAttribute.next(attr);
    }
  }

  onDelete(id) {
    this.attributes.del(id).subscribe(e => {
      if (e['status']) {
        this.updateAttributes();
      }
      else {
        this.errors = e;
      }
    })
  }


}

