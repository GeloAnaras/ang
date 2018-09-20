import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {
  @Output('adding') adding = new EventEmitter<boolean>();

  request: boolean = true;
  errors = null;
  addForm = {
    surname: '',
    name: '',
    secondname: '',
    phone: '',
    email: '',
    password: '',
  };
  password_confirmation: '';

  constructor(private user: UserService ) { }

  ngOnInit() {
  }

  prepareData(product){
    let formData = new FormData();
    for(let key in product) {
      formData.append(key, product[key]);
    }
    return formData;
  }

  onSubmit() {
    if(this.addForm.password !== this.password_confirmation){
      this.errors = {password_confirmation: "Пароли не совпадают"};
      this.password_confirmation = "";
      this.addForm.password = "";
      return;
    }
    if(this.request){
      this.request = false;
      let user = this.prepareData(this.addForm);
      this.user.add(user).subscribe(e => {
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
