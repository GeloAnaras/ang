import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin/admin.service";
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  user = null;
  errors = null;
  constructor(private admin: AdminService, private auth: AuthService, private router: Router) {
    admin.getUser().subscribe(e => {
      if(e['user']){
        this.user = e['user']
      }
      else{
        this.errors = e['error']
      }
    })
  }

  ngOnInit() {
  }

  public onLogout(){
    this.auth.logout().subscribe(e => {
      if(e) this.router.navigate(['/'])
    })
  }

}
