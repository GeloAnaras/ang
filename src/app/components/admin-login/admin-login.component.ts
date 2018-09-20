import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin/admin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public authErrors = {};
  public formData = {
    email: "",
    password: ""
  };

  constructor(private admin: AdminService, private router: Router) { }

  ngOnInit() {
  }

  onLogin() {
    this.admin.login(this.formData.email,this.formData.password).subscribe(e=>{
      if(e['token']){
        this.router.navigate(['admin/main']);
      }
      else{
        this.authErrors = e;
      }
    })
  }

}
