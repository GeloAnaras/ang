import {AfterViewInit, Component, ElementRef, OnInit, ViewChildren} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {ProductService} from "../../../services/product/product.service";
import {DomSanitizer} from "@angular/platform-browser";
import {AttributeService} from "../../../services/attribute/attribute.service";
import {CategoryService} from "../../../services/category/category.service";
import {PaginationService} from "../../../services/pagination/pagination.service";

class Attribute{
  name;
  value;
  Attribute_id;
  Value_id;

  constructor(name: string, value: string, Attribute_id: string, Value_id: string){
    this.name = name;
    this.value = value;
    this.Attribute_id = Attribute_id;
    this.Value_id = Value_id;
  }
}

@Component({
  selector: 'app-goods-page',
  templateUrl: './goods-page.component.html',
  styleUrls: ['./goods-page.component.css']
})
export class GoodsPageComponent implements OnInit, AfterViewInit {
  @ViewChildren('checkboxes') checkboxes;
  paginationStream = null;
  categoryName = null;
  productsArray = null;
  additionalBlocks = null;
  errors = null;
  request: boolean = true;
  attributeArray = null;
  valueArray = null;
  minPrice = 0;
  maxPrice = 0;

  params: Params = {
    order: 'name',
    direction: 'ASC',
    page: 1,
    priceMin: 0,
    priceMax: 0,
  };

  orderColumns = [
    {name: "name",value: "по наименованию"},
    {name: "price",value: "от дешевых к дорогим"},
    {name: "priceHigh",value: "от дорогих к дешевым"},
    {name: "raiting",value: "по популярности"}
  ];

  paginationData = null;


  constructor(private aR: ActivatedRoute, private products: ProductService, private sanitizer: DomSanitizer,
              private attributeService: AttributeService, private categoryService: CategoryService,
              private elref: ElementRef, private paginationService: PaginationService) {
    aR.params.subscribe(e => {
      this.categoryName = aR.snapshot.params['category'];
      if(e['page']){
        let tmpParams = {};
        for(let key in e){
          if(key !== 'category') tmpParams[key] = e[key];
        }
        this.params = tmpParams;
        this.updateProducts();
        this.categoryService.filters(aR.snapshot.params['category']).subscribe(e => {
          this.getAttributes(e);
        });
      }
      else{
        this.params = {
          order: 'name',
          direction: 'ASC',
          page: 1,
          priceMin: 0,
          priceMax: 0,
        };
        this.orderColumns = [
          {name: "name",value: "по наименованию"},
          {name: "price",value: "от дешевых к дорогим"},
          {name: "priceHigh",value: "от дорогих к дешевым"},
          {name: "raiting",value: "по популярности"}
        ];
        if(aR.snapshot.params.page) this.params = aR.snapshot.params;
        this.updateProducts();
        this.categoryService.filters(aR.snapshot.params['category']).subscribe(e => {
          this.getAttributes(e);
        });
      }
    });
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.checkboxes.changes.subscribe(e => {
      let filters = this.elref.nativeElement.querySelectorAll('.checkbox');
      if(filters.length > 0){
        for(let i = 0; i < filters.length; i++){
          for(let key in this.params){
            if(key === filters[i].name){
              let tmpValue = this.params[key].split(',');
              if(tmpValue.length > 1){
                tmpValue.forEach(elem => {
                  if(elem === filters[i].value) filters[i].checked = true;
                })
              }
              else{
                if(tmpValue[0] === filters[i].value) filters[i].checked = true;
              }
            }

          }
        }
      }

    });
  }

  prepareParams(){
    let queryParams ="?";
    for(let key in this.params){
      queryParams += key + "=" + this.params[key] + "&"
    }
    return queryParams;
  }

  updateProducts(){
    if(this.request){
      this.request = false;
      this.products.filters(this.aR.snapshot.params['category'],this.prepareParams()).subscribe(e => {
        this.request = true;
        if(e['prod']){
          this.productsArray = e['prod']['data'];
          if(e['rangePrice']){
            this.params.priceMin = e['rangePrice'].minPrice;
            this.params.priceMax = e['rangePrice'].maxPrice;
            this.minPrice = e['rangePrice'].minPrice;
            this.maxPrice = e['rangePrice'].maxPrice;
          }
          if(e['prod']['data'].length % 3 > 0){
            let addedBlocks = e['prod']['data'].length % 3 === 2 ? 1 : 2;
            this.additionalBlocks = new Array(addedBlocks);
          }
          // this.paginationData = {
          //   current: e['prod'].current_page,
          //   last: e['prod'].last_page,
          //   previous: e['prod'].prev_page_url ? e['prod'].prev_page_url.split('=')[1] : e['prod'].prev_page_url,
          //   next: e['prod'].next_page_url ? e['prod'].next_page_url.split('=')[1] : e['prod'].next_page_url,
          //   order: this.params.order,
          //   direction: this.params.direction
          // }
          let tmpPaginationData = {};
          for(let key in this.params){
            if(key !== 'page'){
              tmpPaginationData[key] = this.params[key];
            }
          }
          tmpPaginationData['current'] = e['prod'].current_page;
          tmpPaginationData['last'] = e['prod'].last_page;
          tmpPaginationData['previous'] = e['prod'].prev_page_url ? e['prod'].prev_page_url.split('=')[1] : e['prod'].prev_page_url;
          tmpPaginationData['next'] = e['prod'].next_page_url ? e['prod'].next_page_url.split('=')[1] : e['prod'].next_page_url;

          this.paginationData = tmpPaginationData;
          this.paginationService.paginationData.next(tmpPaginationData);
        }
        if(e['statusText'] === 'To many requests') {
          this.errors = e;
        }
        else{
          this.errors = e;
        }
      },error => this.errors = {'error':error.error.message})
    }
  }

  ordering(order){
    if(this.request){
      if(order === "priceHigh"){
        this.params.order = "price";
        this.params.direction = "DESC";
      }
      else{
        this.params.order = order;
        this.params.direction = "ASC";
      }
      this.updateProducts();
    }
  }

  makeUrl(url){
    return this.sanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

  getAttributes(id){
      this.attributeArray = null;
      this.valueArray = [];
      this.attributeService.allFromCategory(id).subscribe(e => {
        if(e[0].id){
          let arr = [];
          e[0]['attributes'].forEach(elem => {
            arr.push(elem.name)
          });
          this.attributeArray = arr;

          let valArray = [];
          for (let i =0;i<e[0]['attributes'].length;i++){
            valArray.push(new Attribute(e[0]['attributes'][i].name, "",e[0]['attributes'][i].id,""));
          }
          this.valueArray = valArray;


        }else{
          this.valueArray = this.uniqValues(e);
          this.attributeArray = this.uniqAttr(e);
        }
      })
  }

  uniqValues (values){
    let newArr = [];
    values.forEach(elem => {
      if(newArr.findIndex(i => i.name === elem.name && i.value === elem.value) === -1){
        newArr.push(elem);
      }
    });
    return newArr;
  }

  uniqAttr (attrs){
    let attr = [];
    attrs.forEach(elem =>{
      if(attr.indexOf(elem.name) === -1){
        attr.push(elem.name)
      }
    });
    return attr;
  }

  filtering(attribute){
    this.params.page = 1;
      if(attribute.checked){
        if(attribute.name in this.params){
          let tmpValues = this.params[attribute.name].split(',');
          if(tmpValues.indexOf(attribute.value) < 0){
            this.params[attribute.name] = this.params[attribute.name] + "," + attribute.value;
          }
        }
        else{
          this.params[attribute.name] = attribute.value;
        }
      }
      else{
        let tmpValues = this.params[attribute.name].split(',');
        if(tmpValues.length === 1){
          delete this.params[attribute.name];
        }
        else{
          let deletedIndex = tmpValues.indexOf(attribute.value);
          tmpValues.splice(deletedIndex,1);
          this.params[attribute.name] = tmpValues.join(',');
        }
      }
  }

  cancelRangePrice(){
    this.params.priceMin = 0;
    this.params.priceMax = 0;
  }

  test(){
    console.log(this.paginationData)
  }
}
