import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CategoryService} from "../../../services/category/category.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {
  category = null;
  categoryId = null;

  constructor(private aR:ActivatedRoute, private categories: CategoryService, private sanitizer: DomSanitizer) {
    aR.params.subscribe(e => {
      if(this.categoryId !== e){
        this.updateCategory(e['id']);
      }
      else{
        this.updateCategory(aR.snapshot.params['id']);
      }
    });
  }

  ngOnInit() {
  }

  updateCategory(id){
    this.categories.show(id).subscribe(e => {
      if(e['id']){
        this.category = e;
      }
    })
  }
  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

}
