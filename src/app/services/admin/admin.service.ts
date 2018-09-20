import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {map, tap} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public getToken(){
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  private setToken(token:string){
    localStorage.setItem('token',token);
  }

  private clearToken(){
    localStorage.removeItem('token');
  }

  constructor(private http:HttpClient, private router:Router) { }

  public login(email: string, password: string){
    const params = new HttpParams().set("email", email).set("password", password);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+ this.getToken() + ''
    };
    return this.http.post(environment.apiUrl + 'auth/loginAdmin',params.toString(),{headers})
      .pipe(tap(r=>{
        if(r['token']){
          this.setToken(r['token']);
        }
      }))
  }

  public isAdmin(){
    const params = new HttpParams();
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'auth/isAdmin',params.toString(),{headers})
      .pipe(tap(r => {
        if(r['error']) this.invalidateSession();
      }))
      .pipe(map(r=>r['allowed']))
  }

  private invalidateSession(){
    this.clearToken();
  }

  public getUser(){
    const params = new HttpParams();
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+ this.getToken() + ''
    };
    return this.http.post(environment.apiUrl + 'auth',params.toString(),{headers})
  }

}
