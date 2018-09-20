import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Params} from "@angular/router";
import {PaginationService} from "../../services/pagination/pagination.service";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnDestroy {
  @Input('data') data;

  paramsStream = null;
  filters = false;
  previousData: Params = null;
  lastData: Params = null;
  nextData: Params = null;
  firstData: Params = null;

  constructor( private paginationService: PaginationService) {
      this.paramsStream = paginationService.paginationData.subscribe(e => {
        // console.log(e);
        if(e){
          this.filters = true;
          this.data = e;
        }
        this.previousData = this.prepareParams(['current','last','next']);
        this.lastData = this.prepareParams(['previous','current','next']);
        this.nextData = this.prepareParams(['current','last','previous']);
        let tmpFirst = {};
        tmpFirst = this.prepareParams(['current','last','previous','next']);
        tmpFirst['page'] = 1;
        this.firstData = tmpFirst;
      })
  }

  ngOnInit() {
    if(this.filters){
      this.previousData = this.prepareParams(['current','last','next']);
      this.lastData = this.prepareParams(['previous','current','next']);
      this.nextData = this.prepareParams(['current','last','previous']);
      let tmpFirst = {};
      tmpFirst = this.prepareParams(['current','last','previous','next']);
      tmpFirst['page'] = 1;
      this.firstData = tmpFirst;
    }
  }

  prepareParams(exceptions){
    let tmpParams = {};
    for(let key in this.data){
      if( exceptions.indexOf(key) < 0){
        if( ['current','last','previous','next'].indexOf(key) > -1){
          tmpParams['page'] = this.data[key];
        }
        else{
          tmpParams[key] = this.data[key];
        }
      }
    }
    return tmpParams;
  }
  test(){
    console.log(this.data);
    // console.log(this.nextData);
    // console.log(this.previousData);
    // console.log(this.lastData);
  }

  ngOnDestroy(): void {
    this.paramsStream.unsubscribe();
  }
}
