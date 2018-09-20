import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('data') data;

  ngAfterViewInit(): void {
    this.mover = this.elRef.nativeElement.querySelector('.mover');
  }
  private mover: HTMLElement;
  slides = null;
  private timer = null;
  focus = null;
  interval = null;
  activeSlide = 0;
  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    this.slides = this.data[1];
    if(this.data[0] === "dotted"){
      this.interval = setInterval(() => {
        this.autoSlide();
      }, 4000);
    }

  }

  slideLeft(boost,end) {
    if(this.timer !== null) return;
    let pos = -100;
    let speed = boost ? 4 : 2;
    this.mover.insertBefore(this.mover.lastElementChild,this.mover.firstElementChild);
    this.mover.style.marginLeft = pos + "%";
    this.timer = setInterval(()=>{
      pos += speed;
      this.mover.style.marginLeft = pos + "%";
      if(pos < 0) return;
      clearInterval(this.timer);
      this.mover.style.marginLeft = "";
      this.timer = null;
      this.activeSlide = this.activeSlide > 0 ? this.activeSlide - 1 : this.slides.length - 1;
      if(end) end();
    },10);
  }

  slideRight(boost,end) {
    if(this.timer !== null) return;
    let pos = 0;
    let speed = boost ? 4 : 2;
    this.timer = setInterval(()=>{
      pos -= speed;
      this.mover.style.marginLeft = pos + "%";
      if(pos > -100) return;
      clearInterval(this.timer);
      this.mover.appendChild(this.mover.firstElementChild);
      this.mover.style.marginLeft = "";
      this.timer = null;
      this.activeSlide = this.activeSlide < this.slides.length - 1 ? this.activeSlide + 1 : 0;
      if(end) end();
    },10);
  }

  autoSlide(){
    if(!this.focus){
      this.slideRight(false,false);
    }
  }

  slideTo(pos){
    if(this.activeSlide > pos) this.slideLeft(true,function(){
      this.slideTo(pos);
    }.bind(this));
    if(this.activeSlide < pos) this.slideRight(true,function(){
      this.slideTo(pos);
    }.bind(this));
  }

  ngOnDestroy(): void {
    if(this.interval) clearInterval(this.interval);
  }
}
