import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import {Observable, Observer, Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  editeAttribute = new Subject();


  public getToken(){
    const token = localStorage.getItem('token');
    return token ? token : null;
  }

  constructor(private http:HttpClient, private router:Router) { }

  public allGroups(params){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'attribute/groups' + params,{headers})
  }

  public all(params){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'attribute' + params,{headers})
  }
  public allFromCategory(id){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'attribute/fromCategory/' + id,{headers})
  }

  public addGroup(name :string){
    const params = new HttpParams().set("name", name);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'attribute/addGroup',params.toString(),{headers})
  }

  public add(name :string, group: string){
    const params = new HttpParams().set("name", name).set('Group_id', group);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.post(environment.apiUrl + 'attribute/add',params.toString(),{headers})
  }

  public delGroup(id){
    const params = new HttpParams().set("id", id);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.delete(environment.apiUrl + 'attribute/delGroup',{ headers,params })
  }

  public del(id){
    const params = new HttpParams().set("id", id);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.delete(environment.apiUrl + 'attribute/del',{ headers,params })
  }

  public updateGroups(id: string, name: string){
    const params = new HttpParams()
      .set('id',id)
      .set('name',name);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.patch(environment.apiUrl + 'attribute/updateGroup',params.toString(),{headers})
  }

  public update(id: string, name: string, group: string){
    const params = new HttpParams()
      .set('id',id)
      .set('name',name)
      .set('Group_id',group);
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded',
      'Authorization': 'Bearer '+this.getToken()+''
    };
    return this.http.patch(environment.apiUrl + 'attribute/update',params.toString(),{headers})
  }

  public show(id){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'attribute/' + id,{headers})
  }
  public showGroup(id){
    const headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };
    return this.http.get(environment.apiUrl + 'attribute/group/' + id,{headers})
  }

}
