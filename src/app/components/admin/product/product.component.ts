import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../../services/product/product.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  addMode = false;
  editMode = 0;
  productsArray = null;
  errors = null;

  request: boolean = true;

  params: Params = {
    order: 'id',
    direction: 'ASC',
    page: 1
  };
  colums = [
    {name: "id",value: "номер"},
    {name: "name",value: "наименование"},
    {name: "Producer_id",value: "производитель"},
    {name: "Category_id",value: "категория"},
    {name: "price",value: "цена"},
    {name: "amount",value: "количество"}
  ];
  paginationData = null;

  constructor(private products: ProductService, private aR:ActivatedRoute, private router: Router) {
    aR.params.subscribe(e => {
      if(e['page']){
        this.params.order = e['order'];
        this.params.direction = e['direction'];
        this.params.page = e['page'];
        this.updateProducts();
      }
      else{
        this.params.order = 'id';
        this.params.direction = 'ASC';
        this.params.page = 1;
        if(aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateProducts();
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

  updateProducts(){
    if(this.request){
      this.request = false;
      this.products.all(this.prepareParams()).subscribe(e => {
        this.request = true;
        if(e['prod']){
          this.productsArray = e['prod']['data'];
          this.paginationData = {
            current: e['prod'].current_page,
            last: e['prod'].last_page,
            previous: e['prod'].prev_page_url ? e['prod'].prev_page_url.split('=')[1] : e['prod'].prev_page_url,
            next: e['prod'].next_page_url ? e['prod'].next_page_url.split('=')[1] : e['prod'].next_page_url,
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
    this.products.del(id).subscribe(e => {
      if(e['status']){
        this.updateProducts()
      }else{
        this.errors = e;
      }
    })
  }
}
