import {
  AfterViewInit,
  ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output,
  SecurityContext, ViewChildren
} from '@angular/core';
import {ProductService} from "../../../services/product/product.service";
import {CategoryService} from "../../../services/category/category.service";
import {AttributeService} from "../../../services/attribute/attribute.service";
import {forEach} from "@angular/router/src/utils/collection";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {ProducerService} from "../../../services/producer/producer.service";

class Image{
  id;
  url;
  constructor(id: string, url){
    this.id = id;
    this.url = url;
  }
}

class Attribute{
  name;
  value;
  Attribute_id;
  Value_id;
  constructor(name: string, value: string, Attribute_id: string, Value_id: string){
    this.name = name;
    this.value = value;
    this.Attribute_id = Attribute_id;
    this.Value_id = Value_id;
  }
}


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, AfterViewInit {
  @Input('prodId') prodId;
  @Output('editing') editing = new EventEmitter<boolean>();
  @ViewChildren('Radio') radio;

  request: boolean = true;
  errors = null;
  addForm = {
    id: 0,
    name: '',
    producer: 0,
    category: 0,
    amount: 0,
    price: 0,
    price_old: 0,
    description: "",
    attrs: "",
    image_basic: null,
    image_gallery: [],
    Description_id: 0
  };
  producer = null;
  category = null;
  attributeArray = null;
  valueArray = null;
  url = null;
  urlArray = [];
  oldUrlArray = [];
  oldUrlIndexes = [];
  responseUrl = null;
  attrAdd = false;
  valueAdd = null;
  oldValueArray = null;

  constructor(private products: ProductService, private categories: CategoryService, private attributeService: AttributeService
    ,private fb :FormBuilder, private elref: ElementRef, private cd: ChangeDetectorRef, private sanitizer: DomSanitizer,
              producers: ProducerService) {
    producers.all("").subscribe(e => {
      this.producer = e['producer']['data']
    });
    categories.all("").subscribe(e => {
      this.category = e['category']['data']
    })
  }

  ngOnInit() {
    this.products.show(this.prodId).subscribe(e => {
      if(e['id']){
        this.addForm.id = e['id'];
        this.addForm.name = e['name'];
        this.addForm.producer = e['Producer_id'];
        this.addForm.category = e['Category_id'];
        this.addForm.amount = e['amount'];
        this.addForm.price = e['price'];
        this.addForm.price_old = e['price_old'];
        this.addForm.description = e['description']['text'];
        this.addForm.Description_id = e['Description_id'];
        this.url = this.sanitizer.bypassSecurityTrustStyle('url(' + e['image'] + ')');
        e['images'].forEach(elem => {
          this.oldUrlArray.push(
            new Image(elem.id, this.sanitizer.bypassSecurityTrustStyle('url(' + elem.url + ')'))
          )
        });
        this.getAttributes();
        let valArray = [];
        for (let i =0;i<e['attributes'].length;i++){
          valArray.push(new Attribute(e['attributes'][i].name, e['values'][i].value,e['attributes'][i].id,
            e['values'][i].id));
        }
        this.oldValueArray = valArray;
      }
      else{
        this.onClose();
      }
    })
  }

  ngAfterViewInit(): void {
    this.radio.changes.subscribe(e => {
      let form = this.elref.nativeElement.querySelector('.addForm').querySelectorAll('.radio');
      if(form.length > 0){
        for(let i = 0; i < form.length; i++){
          this.oldValueArray.forEach(elem => {
            if(form[i].name === elem.name && form[i].value === elem.value){
              form[i].checked = true;
            }
          });
        }
      }

    });
  }

  onClose(){
    this.editing.emit(false);
  }

  getAttributes(){
    this.attributeArray = null;
    this.valueArray = [];
    this.attributeService.allFromCategory(this.addForm.category).subscribe(e => {
      if(e[0].id){
        let arr = [];
        e[0]['attributes'].forEach(elem => {
          arr.push(elem.name)
        });
        this.attributeArray = arr;
      }else{
        this.valueArray = this.uniqValues(e);
        this.attributeArray = this.uniqAttr(e);
      }
    })
  }

  uniqValues (values){
    let newArr = [];
    values.forEach(elem => {
      if(newArr.findIndex(i => i.name === elem.name && i.value === elem.value) === -1){
        newArr.push(elem);
      }
    });
    return newArr;
  }

  uniqAttr (attrs){
    let attr = [];
    attrs.forEach(elem =>{
      if(attr.indexOf(elem.name) === -1){
        attr.push(elem.name)
      }
    });
    return attr;
  }
  getFilters(){
    let attributeArray = [];
    this.addForm.attrs = "";
    let attributes = this.elref.nativeElement.querySelector('.addForm').elements.attr.elements;
    for(let i = 0; i < attributes.length; i++){
      if(attributes[i].checked){
        attributeArray.push( new Attribute(
          attributes[i].name
          ,attributes[i].value
          ,attributes[i].dataset.attributeId
          ,attributes[i].dataset.valueId)
        )
      }
    }
    this.addForm.attrs = JSON.stringify(attributeArray);
  }

  prepareData(product){
    let formData = new FormData();
    if(this.oldUrlIndexes.length > 0){
      formData.append('oldImage',JSON.stringify(this.oldUrlIndexes));
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

  onSubmit() {
    if(this.request){
      this.request = false;
      this.getFilters();
      let product = this.prepareData(this.addForm);
      this.products.update(product).subscribe(e => {
        this.request = true;
        this.responseUrl = this.sanitizer.bypassSecurityTrustStyle('url(' + e['url'] + ')');
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

  imageBasicChange(event) {
    this.addForm.image_basic = event.target.files[0];
    let path = window.URL.createObjectURL(event.target.files[0]);
    this.url = this.sanitizer.bypassSecurityTrustStyle('url(' + path + ')')  ;
  }

  imageGalleryChange(event) {
    let files = event.target.files;
    for(let i = 0; i < files.length; i++){
      let file = files[i];
      this.addForm.image_gallery.push(file);
      let path = window.URL.createObjectURL(file);
      this.urlArray.push( this.sanitizer.bypassSecurityTrustStyle('url(' + path + ')') )
    }
  }

  onValueAdd(attr) {
    this.attrAdd = false;
    this.valueAdd === attr ? this.valueAdd = null : this.valueAdd = attr;
  }

  onValueAdding() {
    let value = this.elref.nativeElement.querySelector('.addForm').elements.newvalue.elements;
    if(value.newValue.value !== ""){
      let newValue = true;
      let attr_id = "";
      this.valueArray.forEach(elem => {
        if(elem.name === this.valueAdd){
          attr_id = elem.Attribute_id;
          if(elem.value === value.newValue.value.trim()) newValue = false;
        }
      });
      if(newValue){
        this.valueArray.push(new Attribute(this.valueAdd, value.newValue.value,attr_id,'new'));
        this.valueAdd = null;
      }
    }
  }

  indexExist(id){
    return this.oldUrlIndexes.indexOf(id) < 0;
  }

  oldIndex(id){
    this.oldUrlIndexes.push(id);
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  test(){

  }

}
