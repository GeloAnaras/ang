import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  addMode = false;
  editMode = false;
  usersArray = null;
  errors = null;

  request: boolean = true;
  params: Params = {
    order: 'id',
    direction: 'ASC',
    page: 1
  };
  colums = [
    {name: "id",value: "номер"},
    {name: "surname",value: "фамилия"},
    {name: "name",value: "имя"},
    {name: "secondname",value: "отчество"},
    {name: "phone",value: "телефон"},
    {name: "email",value: "почта"}
  ];
  paginationData = null;

  constructor(private users: UserService, private aR:ActivatedRoute,) {

    aR.params.subscribe(e => {
      if(e['page']){
        this.params.order = e['order'];
        this.params.direction = e['direction'];
        this.params.page = e['page'];
        this.updateUsers();
      }
      else{
        if(aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateUsers();
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
  updateUsers(){
    if(this.request){
      this.request = false;
      this.users.all(this.prepareParams()).subscribe(e => {
        this.request = true;
        if(e['user']){
          this.usersArray = e['user']['data'];
          this.paginationData = {
            current: e['user'].current_page,
            last: e['user'].last_page,
            previous: e['user'].prev_page_url ? e['user'].prev_page_url.split('=')[1] : e['user'].prev_page_url,
            next: e['user'].next_page_url ? e['user'].next_page_url.split('=')[1] : e['user'].next_page_url,
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
    this.users.del(id).subscribe(e => {
      if(e['status']){
        this.updateUsers()
      }else{
        this.errors = e;
      }
    })
  }

}

