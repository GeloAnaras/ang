import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {BasketService} from "../../services/basket/basket.service";

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit, OnDestroy {
  @Output('close') close = new EventEmitter<boolean>();
  basket = null;

  constructor(private basketService: BasketService) {
    this.basket = basketService.basket.subscribe(e => {
      console.log(e);
    })
  }

  ngOnInit() {
  }

  closeWindow() {
    this.close.emit(true);
  }

  ngOnDestroy(): void {
    this.basket.unsubscribe();
  }
}
