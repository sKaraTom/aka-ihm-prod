import { Injectable }     from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, Route} from '@angular/router';
import { Observable } from "rxjs/Observable";



@Injectable()
export class ContactGuard implements CanActivate  {

 constructor(private router: Router) {}

 /**
  * pour rediriger vers l'accueil si tentative d'accéder au formulaire de contact
  * par url du navigateur.
  * 
  * @param route 
  * @param state 
  */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

      this.router.navigate(['/accueil']);  

      return Observable.of(false);
  }


}