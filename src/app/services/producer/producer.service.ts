import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProducerService {

  public getToken(){
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  constructor(private http:HttpClient, private router:Router) { }

  public all(params){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'producer' + params,{headers})
  }

  public show(id){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'producer/' + id,{headers})
  }

  public add(producer){
    const headers = {
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'producer/add',producer,{headers})
  }

  public del(id){
    const params = new HttpParams().set("id", id);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.delete(environment.apiUrl + 'producer/del',{ headers,params })
  }

  public update(producer) {
    const headers = {
      'Authorization': 'Bearer ' + this.getToken() + ''
    };
    return this.http.post(environment.apiUrl + 'producer/update', producer, {headers})
  }
}
