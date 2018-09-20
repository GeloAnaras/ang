import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../services/user/user.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  @Input('userId') userId;
  @Output('editing') editing = new EventEmitter<boolean>();

  request: boolean = true;
  errors = null;
  addForm = {
    id: 0,
    surname: '',
    name: '',
    secondname: '',
    phone: '',
    email: '',
    newPassword: '',
    role: 0,
  };
  rolesArray = null;
  password_confirmation = '';

  constructor(private user: UserService) {}

  ngOnInit() {
    this.user.show(this.userId).subscribe(e => {
      if(e['user']['id']){
        this.addForm.id = e['user']['id'];
        this.addForm.surname = e['user']['surname'];
        this.addForm.name = e['user']['name'];
        this.addForm.secondname = e['user']['secondname'];
        this.addForm.phone = e['user']['phone'];
        this.addForm.email = e['user']['email'];
        this.addForm.role = e['user']['roles']['0']['id'];
        this.rolesArray = e['roles'];
      }
      else{
        this.onClose();
      }
    })
  }

  prepareData(product){
    let formData = new FormData();
    for(let key in product) {
      formData.append(key, product[key]);
    }
    return formData;
  }

  onSubmit() {
    if(this.addForm.newPassword !== this.password_confirmation){
      this.errors = {password_confirmation: "Пароли не совпадают"};
      this.password_confirmation = "";
      this.addForm.newPassword = "";
      return;
    }
    if(this.request){
      this.request = false;
      let user = this.prepareData(this.addForm);
      this.user.update(user).subscribe(e => {
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

}

