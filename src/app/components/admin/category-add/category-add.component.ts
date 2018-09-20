import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CategoryService} from "../../../services/category/category.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {
  @Output('adding') adding = new EventEmitter<boolean>();

  request: boolean = true;
  public groups = null;
  public addForm = {
    id: 0,
    name: "",
    parent_category: 0,
    image: null
  };
  url = null;
  categoriesArray = null;
  errors = null;
  constructor(private categories: CategoryService, private sanitizer: DomSanitizer) {
    this.categories.all("").subscribe(e => {
      this.categoriesArray = e['category']['data']
    })
  }

  ngOnInit() {
  }

  prepareData(product){
    let formData = new FormData();
    for(let key in product) {
      if (Array.isArray(product[key])) {
        product[key].forEach((elem,index) => {
          formData.append(key + "." + index, elem)
        });
      } else {
        formData.append(key, product[key]);
      }
    }
    return formData;
  }

  imageBasicChange(event) {
    this.addForm.image = event.target.files[0];
    let path = window.URL.createObjectURL(event.target.files[0]);
    this.url = this.sanitizer.bypassSecurityTrustStyle('url(' + path + ')')  ;
  }


  onSubmit(){
    if(this.request){
      this.request = false;
      let category = this.prepareData(this.addForm);
      this.categories.add(category).subscribe(e => {
        this.request = true;
        if(e['status']){
          this.onClose();
        }
        if(e['statusText'] === 'To many requests'){
          this.errors = e;
        }
        else{
          this.errors = e;
        }
      },error => this.errors = {'error':error.error.message})
    }

  }

  onClose(){
    this.adding.emit(true);
  }
}
