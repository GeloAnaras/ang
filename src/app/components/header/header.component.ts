import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authOpen = false;
  authorized = false;

  constructor(private auth: AuthService) {
    auth.isAuth().subscribe(e=>{
      this.authorized = e;
    });
  }

  ngOnInit() {
  }

  openAuth(){
    this.authOpen = true;
  }

  onLogout() {
    this.auth.logout().subscribe(e=>{
      if(e) this.authorized = false;
    })
  }
}
