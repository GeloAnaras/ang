import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {map, tap} from "rxjs/internal/operators";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  public getToken(){
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  constructor(private http:HttpClient, private router:Router) { }

  public all(params){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'category' + params,{headers})
  }

  public show(id){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'category/' + id,{headers})
  }

  public add(category){
    const headers = {
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'category/add',category,{headers})
  }

  public del(id){
    const params = new HttpParams().set("id", id);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.delete(environment.apiUrl + 'category/del',{ headers,params })
  }

  public update(category) {
    const headers = {
      'Authorization': 'Bearer ' + this.getToken() + ''
    };
    return this.http.post(environment.apiUrl + 'category/update', category, {headers})
  }

  public filters(category){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'category/filters/' + category,{headers})
  }
}
