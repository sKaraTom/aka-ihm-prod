import { Injectable }     from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, Route} from '@angular/router';
import { Observable } from "rxjs/Observable";



@Injectable()
export class ContactGuard implements CanActivate  {

 constructor(private router: Router) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

      this.router.navigate(['/accueil']);  

      return Observable.of(false);
  }


}