import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CategoryService} from "../../../services/category/category.service";
import {DomSanitizer} from "@angular/platform-browser";
import {AttributeService} from "../../../services/attribute/attribute.service";
import {forEach} from "@angular/router/src/utils/collection";

class Attribute{
  name;
  id;
  constructor(name: string, id: string,){
    this.name = name;
    this.id = id;
  }
}

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
  @Input('prodId') prodId;
  @Output('editing') editing = new EventEmitter<boolean>();

  request: boolean = true;
  addForm = {
    id: 0,
    name: '',
    image: null,
    parent_category: 0,
    attrs: ""
  };
  url = null;
  errors = null;
  categoriesArray = null;
  categoryAttributes = null;
  allAttributes = null;
  attributesArray = null;
  attrs = false;
  oldIndexes = [];

  constructor(private categories: CategoryService,  private sanitizer: DomSanitizer,
              private attributes: AttributeService, private elref: ElementRef) {
    this.categories.all("").subscribe(e => {
      this.categoriesArray = e['category']['data']
    });
    this.attributes.all("").subscribe(e => {
      if( e['attributes']['data'] && e['attributes']['data'].length > 0){
        this.attrs = true;
        this.allAttributes = e['attributes']['data'];
      }else{
        this.errors = e['error']
      }
    })
  }

  ngOnInit() {
    this.categories.show(this.prodId).subscribe(e => {
      if(e['id']){
        this.addForm.id = e['id'];
        this.addForm.name = e['name'];
        this.addForm.parent_category = e['parent_category'];
        this.url = this.sanitizer.bypassSecurityTrustStyle('url(' + e['image'] + ')');
        this.categoryAttributes = e['attributes'];
        this.attributesArray = this.uniqAttr(this.allAttributes);
      }
      else{
        this.errors = e;
      }
    })
  }

  uniqAttr (attrs){
    let attr = [];
    let catAttrs = [];
    for (let i =0; i<this.categoryAttributes.length;i++){
      catAttrs.push(this.categoryAttributes[i].name)
    }
    attrs.forEach(elem =>{
      if(catAttrs.indexOf(elem.name) === -1){
        attr.push(new Attribute(elem.name,elem.id))
      }
    });
    return attr;
  }

  prepareData(product){
    let formData = new FormData();
    if(this.oldIndexes.length > 0){
      formData.append('oldAttrs',JSON.stringify(this.oldIndexes));
    }
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
      if(this.attrs){
        let value = this.elref.nativeElement.querySelector('.addForm').elements.newattrs.options;
        let newAttrs = [];
        for(let i = 0; i<value.length;i++){
          if(value[i].selected) newAttrs.push(value[i].value);
        }
        this.addForm.attrs = JSON.stringify(newAttrs);
      }
      let category = this.prepareData(this.addForm);
      this.categories.update(category).subscribe(e => {
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

  oldIndex(id){
    this.oldIndexes.push(id);
    let attrs = [];
    this.categoryAttributes.forEach(elem =>{
      if(elem.id !== id){
        attrs.push(elem);
      }
    });
    this.categoryAttributes = attrs;
  }

  onClose(){
    this.editing.emit(true);
  }

}
