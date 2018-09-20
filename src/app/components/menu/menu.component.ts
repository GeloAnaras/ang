import { Component, OnInit } from '@angular/core';
import {CategoryService} from "../../services/category/category.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  categoriesArray = null;

  constructor(private categories: CategoryService) {
    categories.all("").subscribe(e => {
      this.categoriesArray = e['category']['data']
    })
  }

  ngOnInit() {
  }

}
