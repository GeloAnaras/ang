import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProducerService} from "../../../services/producer/producer.service";
import {DomSanitizer} from "@angular/platform-browser";

class Image{
  id;
  url;
  constructor(id: string, url){
    this.id = id;
    this.url = url;
  }
}

@Component({
  selector: 'app-producer-edit',
  templateUrl: './producer-edit.component.html',
  styleUrls: ['./producer-edit.component.css']
})
export class ProducerEditComponent implements OnInit {
  @Input('prodId') prodId;
  @Output('editing') editing = new EventEmitter<boolean>();

  producer;
  request: boolean = true;
  errors = null;
  addForm = {
    id: 0,
    name: '',
    image_basic: null,
    image_gallery: []
  };
  url = null;
  urlArray = [];
  oldUrlArray = [];
  oldUrlIndexes = [];

  constructor(private producers: ProducerService, private sanitizer: DomSanitizer,) {


  }

  ngOnInit() {
    this.producers.show(this.prodId).subscribe(e => {
      if(e['id']){
        this.addForm.id = e['id'];
        this.addForm.name = e['name'];
        this.url = this.sanitizer.bypassSecurityTrustStyle('url(' + e['image'] + ')');
        e['images'].forEach(elem => {
          this.oldUrlArray.push(
            new Image(elem.id, this.sanitizer.bypassSecurityTrustStyle('url(' + elem.url + ')'))
             )
        })
      }
      else{
        this.onClose();
      }
    })
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

  onSubmit() {
    if(this.request){
      this.request = false;
      let producer = this.prepareData(this.addForm);
      this.producers.update(producer).subscribe(e => {
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
    this.editing.emit(false);
  }

  indexExist(id){
    return this.oldUrlIndexes.indexOf(id) < 0;
  }

  oldIndex(id){
    this.oldUrlIndexes.push(id);
  }

}
