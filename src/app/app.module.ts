import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { FooterComponent } from './components/footer/footer.component';
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {AuthComponent} from "./components/auth/auth.component";
import { BasketComponent } from './components/basket/basket.component';
import { MasterComponent } from './components/master/master.component';
import { OrderingComponent } from './components/ordering/ordering.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminMainComponent } from './components/admin/admin-main/admin-main.component';
import {AdminGuardService} from "./services/guards/admin-guard/admin-guard.service";
import {NoAuthGuardService} from "./services/guards/no-auth-guard/no-auth-guard.service";
import { CategoryComponent } from './components/admin/category/category.component';
import { AttributeComponent } from './components/admin/attribute/attribute.component';
import { AttributeGroupsComponent } from './components/admin/attribute-groups/attribute-groups.component';
import { AttributeAddComponent } from './components/admin/attribute-add/attribute-add.component';
import { AttributeEditComponent } from './components/admin/attribute-edit/attribute-edit.component';
import { ProductComponent } from './components/admin/product/product.component';
import { ProductAddComponent } from './components/admin/product-add/product-add.component';
import { WysiwygComponent } from './components/wysiwyg/wysiwyg.component';
import {AngularEditorModule} from "@kolkov/angular-editor";
import { ProducerComponent } from './components/admin/producer/producer.component';
import { ProducerAddComponent } from './components/admin/producer-add/producer-add.component';
import { ProducerEditComponent } from './components/admin/producer-edit/producer-edit.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AttributeGroupsAddComponent } from './components/admin/attribute-groups-add/attribute-groups-add.component';
import { AttributeGroupsEditComponent } from './components/admin/attribute-groups-edit/attribute-groups-edit.component';
import { CategoryAddComponent } from './components/admin/category-add/category-add.component';
import { CategoryEditComponent } from './components/admin/category-edit/category-edit.component';
import { ProductEditComponent } from './components/admin/product-edit/product-edit.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { UserComponent } from './components/admin/user/user.component';
import { UserAddComponent } from './components/admin/user-add/user-add.component';
import { UserEditComponent } from './components/admin/user-edit/user-edit.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { OrdersComponent } from './components/admin/orders/orders.component';
import { MenuComponent } from './components/menu/menu.component';
import { MainPageComponent } from './components/main/main-page/main-page.component';
import { SearchComponent } from './components/search/search.component';
import { SliderComponent } from './components/slider/slider.component';
import { ProductMainComponent } from './components/product-main/product-main.component';
import {Ng2SimplePageScrollModule} from "ng2-simple-page-scroll";
import { CategoryPageComponent } from './components/main/category-page/category-page.component';
import { GoodsPageComponent } from './components/main/goods-page/goods-page.component';
import { BasketIconComponent } from './components/basket-icon/basket-icon.component';


const adminSubroutes: Routes = [
  {path: '', canActivateChild: [AdminGuardService], children: [
      {path: '', component: AdminMainComponent},
      {path: 'main', component: AdminMainComponent},
      {path: 'category', component: CategoryComponent},
      {path: 'producer', component: ProducerComponent},
      {path: 'attribute', component: AttributeComponent},
      {path: 'attribute/groups', component: AttributeGroupsComponent},
      {path: 'product', component: ProductComponent},
      {path: 'users', component: UserComponent},
      {path: 'orders', component: OrdersComponent}
    ]}
];

const mainSubroutes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'test2', component: OrderingComponent},
  {path: 'product/:id', component: ProductMainComponent},
  {path: 'category/:id', component: CategoryPageComponent},
  {path: 'goods/:category', component: GoodsPageComponent},

];
const masterSubroutes: Routes = [
  {path: '', component: MainComponent, children: mainSubroutes},



];

const routes: Routes = [
  {path: '', component: MasterComponent, children: masterSubroutes},
  {path: 'ordering', component: OrderingComponent},
  {path: 'admin/login', component: AdminLoginComponent},


  {path: 'admin', component: AdminComponent,canActivate: [AdminGuardService], children: adminSubroutes},
  {path: '**', component: PageNotFoundComponent},

  // {path: '', component: MainComponent, canActivate: [AuthGuardService], children: mainSubroutes},
  // {path: 'login', component: AuthComponent, canActivate: [NoAuthGuardService]}
];

@NgModule({
  declarations: [
    AppComponent,

    HeaderComponent,
    MainComponent,
    FooterComponent,
    AuthComponent,
    BasketComponent,
    MasterComponent,
    OrderingComponent,
    AdminComponent,
    AdminLoginComponent,
    AdminMainComponent,
    CategoryComponent,
    AttributeComponent,
    AttributeGroupsComponent,
    AttributeAddComponent,
    AttributeEditComponent,
    ProductComponent,
    ProductAddComponent,
    WysiwygComponent,
    ProducerComponent,
    ProducerAddComponent,
    ProducerEditComponent,
    PageNotFoundComponent,
    AttributeGroupsAddComponent,
    AttributeGroupsEditComponent,
    CategoryAddComponent,
    CategoryEditComponent,
    ProductEditComponent,
    PreloaderComponent,
    UserComponent,
    UserAddComponent,
    UserEditComponent,
    PaginatorComponent,
    OrdersComponent,
    MenuComponent,
    MainPageComponent,
    SearchComponent,
    SliderComponent,
    ProductMainComponent,
    CategoryPageComponent,
    GoodsPageComponent,
    BasketIconComponent,




  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AngularEditorModule,
    ReactiveFormsModule,
    Ng2SimplePageScrollModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
