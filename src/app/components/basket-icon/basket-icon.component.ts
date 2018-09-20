import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasketService} from "../../services/basket/basket.service";



@Component({
  selector: 'app-basket-icon',
  templateUrl: './basket-icon.component.html',
  styleUrls: ['./basket-icon.component.css']
})
export class BasketIconComponent implements OnInit, OnDestroy {
  basket = null;
  basketArray = [];

  constructor(private basketService: BasketService) {
    this.basket = basketService.storageStream.subscribe(e => {
      console.log(e);
      // this.basketArray.push(new Product(e['id'],e['name'],e['price'],e['image'],1))
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.basket.unsubscribe();
  }
  test(){
    console.log(this.basketArray);
  }
}
