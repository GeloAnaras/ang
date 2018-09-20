import { Injectable } from '@angular/core';
import {Observable, Observer, Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor() {
    window.localStorage.getItem("basket") ?
      window.localStorage.getItem("basket") :
      window.localStorage.setItem("basket",JSON.stringify([]));
  }
  basket = new Subject();
  basketObserver = null;

  storageStream = Observable.create((obserrver:Observer<any>)=>{
    this.basketObserver = obserrver;
  });

  getProducts(){
    return JSON.parse(window.localStorage.getItem("basket"));
  }

  addProduct(product){
    let tmpProducts = this.getProducts();
    tmpProducts.push(product);
    window.localStorage.setItem("basket",JSON.stringify(tmpProducts));
    this.basketObserver.next(JSON.parse(window.localStorage.getItem("basket")))
  }
}
