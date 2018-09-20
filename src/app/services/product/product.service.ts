import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient, private router:Router) { }

  public getToken(){
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  public filters(category,params){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'product/filters/' + category + params,{headers})
  }


  public all(params){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'product' + params,{headers})
  }

  public add(product){
    const headers = {
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'product/add',product,{headers})
  }

  public del(id){
    const params = new HttpParams().set("id", id);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.delete(environment.apiUrl + 'product/del',{ headers,params })
  }

  public show(id){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'product/' + id,{headers})
  }

  public update(product) {
    const headers = {
      'Authorization': 'Bearer ' + this.getToken() + ''
    };
    return this.http.post(environment.apiUrl + 'product/update', product, {headers})
  }
}

