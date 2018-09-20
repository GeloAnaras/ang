import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ProducerService} from "../../../services/producer/producer.service";

@Component({
  selector: 'app-producer-add',
  templateUrl: './producer-add.component.html',
  styleUrls: ['./producer-add.component.css']
})
export class ProducerAddComponent implements OnInit {
  @Output('adding') adding = new EventEmitter<boolean>();

  request: boolean = true;
  errors = null;
  addForm = {
    name: '',
    image_basic: null,
    image_gallery: []
  };
  url = null;
  urlArray = [];

  constructor(private sanitizer: DomSanitizer, private producer: ProducerService ) { }

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
      let product = this.prepareData(this.addForm);
      this.producer.add(product).subscribe(e => {
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
    this.adding.emit(false);
  }
}
