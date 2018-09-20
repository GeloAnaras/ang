import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import {CategoryService} from "../../services/category/category.service";

@Component({
  selector: 'app-product-main',
  templateUrl: './product-main.component.html',
  styleUrls: ['./product-main.component.css']
})
export class ProductMainComponent implements OnInit {
  product = null;
  slides = null;
  attributes = null;

  constructor(private aR:ActivatedRoute, private products:ProductService,  private sanitizer: DomSanitizer
  , private category: CategoryService) {
  }

  ngOnInit() {
    this.products.show(this.aR.snapshot.params["id"]).subscribe(e => {
      if(e['id']){
        this.category.show(e['Category_id']).subscribe(e => {
          this.attributes = e['attributes'];
        });
        this.product = e;
        let slides = [];
        let data: Array<any> = ["icons"];
        e['images'].forEach(elem => {
          slides.push(this.makeUrl(elem.url))
        });
        data.push(slides);
        this.slides = data;
      }
    })
  }

  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

  test(prod){
    console.log(prod);
  }

}
