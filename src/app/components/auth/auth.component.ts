import {Component, EventEmitter, OnInit, Output} from '@angular/core';

import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  @Output('close') close = new EventEmitter<boolean>();
  @Output('authorize') authorize = new EventEmitter<boolean>();

  authErrors = {};

  currentForm = "login";
  formData = {
    surname: "",
    name: "",
    secondname: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: ""

  };
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onRegister() {
    if(this.formData.password !== this.formData.password_confirmation){
      this.authErrors= {password_confirmation: "Passwords not the same"};
      this.formData.password_confirmation = "";
      this.formData.password = "";
      return;
    }
    this.auth.register(
      this.formData.surname
      ,this.formData.name
      ,this.formData.secondname
      ,this.formData.phone
      ,this.formData.email
      ,this.formData.password
    ).subscribe(res => {
      if (res['status'] === 'success') {
        this.authErrors = {};
        this.currentForm = 'login';
      } else {
        this.authErrors = res;
      }
    })
  }

  onLogin() {
    this.auth.login(this.formData.email,this.formData.password).subscribe(e=>{
      if(e['token']){
        this.router.navigate(['/']);
        this.authorize.emit(true);
        this.closeWindow();
      }
      else{
        this.authErrors = e;
      }
    })
  }

  closeWindow() {
    this.close.emit(true);
  }
}
