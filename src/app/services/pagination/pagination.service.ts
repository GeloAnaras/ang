import { Injectable } from '@angular/core';
import {Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  paginationData = new Subject();

  // onSearch(value){
  //   this.search.next(value)
  // }
  //
  // consoleSearch = this.search.pipe(debounce( ()=> timer(1000) )).subscribe(e => {
  //   this.categories.all().subscribe(e => {
  //     console.log(e);
  //   })
  // });
}
