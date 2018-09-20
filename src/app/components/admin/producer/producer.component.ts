import { Component, OnInit } from '@angular/core';
import {ProducerService} from "../../../services/producer/producer.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-producer',
  templateUrl: './producer.component.html',
  styleUrls: ['./producer.component.css']
})
export class ProducerComponent implements OnInit {
  addMode = false;
  editMode = false;
  producersArray = null;
  errors = null;

  request: boolean = true;
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
  constructor(private producers: ProducerService, private aR:ActivatedRoute) {

    aR.params.subscribe(e => {
      if(e['page']){
        this.params.order = e['order'];
        this.params.direction = e['direction'];
        this.params.page = e['page'];
        this.updateProducers();
      }
      else{
        this.params.order = 'id';
        this.params.direction = 'ASC';
        this.params.page = 1;
        if(aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateProducers();
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
  updateProducers(){
    if(this.request){
      this.request = false;
      this.producers.all(this.prepareParams()).subscribe(e => {
        this.request = true;
        if(e['producer']){
          this.producersArray = e['producer']['data'];
          this.paginationData = {
            current: e['producer'].current_page,
            last: e['producer'].last_page,
            previous: e['producer'].prev_page_url ? e['producer'].prev_page_url.split('=')[1] : e['producer'].prev_page_url,
            next: e['producer'].next_page_url ? e['producer'].next_page_url.split('=')[1] : e['producer'].next_page_url,
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

  onDelete(id){
    this.producers.del(id).subscribe(e => {
      if(e['status']){
        this.updateProducers()
      }else{
        this.errors = e;
      }
    })
  }

}
