import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CategoryService} from "../../services/category/category.service";
import {filter} from "rxjs/internal/operators";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy{
  categoriesArray = null;
  basketOpen = false;
  menu = false;
  scrollBound = null;

  constructor(private router: Router, private elRef: ElementRef, private categories: CategoryService) {
    categories.all("").subscribe(e => {
      this.categoriesArray = e['category']['data']
    });

    router.events
      .pipe(
        filter(e => e instanceof NavigationEnd)
      )
      .subscribe( (navEnd:NavigationEnd) => {
        if(navEnd.urlAfterRedirects !== "/" ){
          if (!this.scrollBound) {
            this.scrollBound = this.scrollHandler.bind(this);
          }
          window.addEventListener('scroll',this.scrollBound);
        }
        else{
          window.removeEventListener('scroll',this.scrollBound);
        }
      });
  }

  ngOnInit() {

  }
  scrollHandler(){
      let page = window.pageYOffset || document.documentElement.scrollTop;
      let header = this.elRef.nativeElement.querySelector('.header');
      let block = this.elRef.nativeElement.querySelector('.block');
      if( header.getBoundingClientRect().bottom < 0){
        header.style.position = "fixed";
        header.style.backgroundColor = "#c7dcde";
        header.style.top = "0";
        header.style.left = "0";
        header.style.right = "0";
        header.style.zIndex = "1000";
        block.style.margin = "auto";
        block.style.maxWidth = "1024px";
      }
      if(page < 50){
        header.style.position = "";
        header.style.width = "";
        header.style.maxWidth = "1";
        header.style.top = "";
        header.style.left = "";
        header.style.transform = "";
        header.style.zIndex = "";
      }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll',this.scrollBound);
  }

}
