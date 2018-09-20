import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {map, tap} from "rxjs/internal/operators";
import {Observable} from "rxjs/index";
import {AuthService} from "../../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuardService implements CanActivate{
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isAuth().pipe(tap(r=>{
      if(r) this.router.navigate(['/'])
    }))
  }

  constructor(private router:Router,private auth: AuthService) { }
}
