import {AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {ProductService} from "../../../services/product/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import {BasketService} from "../../../services/basket/basket.service";

class Product{
  id;
  name;
  price;
  image;
  amount;

  constructor(id: string, name: string, price: string, image: string, amount: number){
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.amount = amount;
  }
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, AfterViewInit, AfterContentInit {
  @ViewChildren('moverNew') moverNew;

  private mover: HTMLElement;
  dataArray = [
    "dotted",
    [
      "url('../../../assets/mainSlides/1.jpg')",
      "url('../../../assets/mainSlides/2.jpg')",
      "url('../../../assets/mainSlides/3.jpg')",
      "url('../../../assets/mainSlides/4.jpg')",
      "url('../../../assets/mainSlides/5.jpg')"
    ]

  ];

  newest = null;

  constructor(private products: ProductService, private elRef: ElementRef, private sanitizer: DomSanitizer,
              private basketService: BasketService) {
    products.all("?order=created_at&direction=DESC").subscribe(e => {
      if(e['prod']['data']) this.newest = e['prod']['data'];
    })
  }

  ngOnInit() {
  }

  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {

    this.moverNew.changes.subscribe(e => {
      this.mover = this.elRef.nativeElement.querySelector('.mover-new');
    });
  }

  private timer = null;

  slideLeft() {
    if(this.timer !== null) return;
    let pos = -25;
    this.mover.insertBefore(this.mover.lastElementChild,this.mover.firstElementChild);
    this.mover.style.marginLeft = pos + "%";
    this.timer = setInterval(()=>{
      pos += 1;
      this.mover.style.marginLeft = pos + "%";
      if(pos <= 0) return;
      clearInterval(this.timer);
      this.mover.style.marginLeft = "";
      this.timer = null;
    },10);
  }

  slideRight() {
    if(this.timer !== null) return;
    let pos = 0;
    this.timer = setInterval(()=>{
      pos -= 1;
      this.mover.style.marginLeft = pos + "%";
      if(pos >= -25) return;
      clearInterval(this.timer);
      this.mover.appendChild(this.mover.firstElementChild);
      this.mover.style.marginLeft = "";
      this.timer = null;
    },10);
  }

  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

  test(prod){
    this.basketService.addProduct(new Product(prod.id,prod.name,prod.price,prod.image,1));
  }

}
