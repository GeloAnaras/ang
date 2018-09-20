import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {map, tap} from "rxjs/internal/operators";
@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  public register(surname: string, name: string, secondname: string, phone: string, email: string, password: string){

    const params = new HttpParams()
      .set("surname", surname)
      .set("name", name)
      .set("secondname", secondname)
      .set("phone", phone)
      .set("email", email)
      .set("password", password);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this.getToken() + ''
    };

    return this.http.post(environment.apiUrl + 'auth/register',params.toString(),{headers})

  }

  public login(email: string, password: string){
    const params = new HttpParams().set("email", email).set("password", password);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.post(environment.apiUrl + 'auth/login',params.toString(),{headers})
      .pipe(tap(r=>{
        if(r['token']) this.setToken(r['token']);
      }))
  }

  public logout() {
    const params = new HttpParams();
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'auth/logout',params.toString(),{headers})
      .pipe(map(r=>r['status']==='success')).pipe(tap(e=>this.clearToken()))
  }

  public isAuth(){
    const params = new HttpParams();
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'auth/isAuth',params.toString(),{headers})
      .pipe(tap(r => {
        if(r['error']) this.invalidateSession();
      }))
      .pipe(map(r=>r['allowed']))
  }

  private invalidateSession(){
    this.clearToken();
    // this.router.navigate(['/login']);
  }

}
