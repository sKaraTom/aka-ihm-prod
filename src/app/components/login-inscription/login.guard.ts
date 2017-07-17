import { Injectable }     from '@angular/core';
import { CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route
} from '@angular/router';
import { AuthentificationService } from "../../services/authentification.service";
import { Observable } from "rxjs/Observable";



@Injectable()
export class LoginGuard implements CanActivate, CanActivateChild, CanLoad  {

 constructor(private authService: AuthentificationService, private router: Router) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
     let url: string = state.url;

      return this.checkLogin(url);

  }


    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
           return this.canActivate(route, state);  
    }

    canLoad(route: Route): boolean {
    return true;
}

 
  checkLogin(url: string): Observable<boolean> {

      if( (localStorage.getItem('token')) && (localStorage.getItem('id')) && (localStorage.getItem('prenom')) ) { 
          
          // si token validé : client connecté donc redirection vers accueil client.
          if(this.authService.estConnecte().toPromise()) {
            this.authService.redirectUrl = url;
            this.router.navigate(['/accueil/cli']);
            return  Observable.of(false);
          }

          // sinon accès à page accepté
          else {
                return Observable.of(true);
          }

      }

    else {
        // si pas de local storage alors page accessible.
        return Observable.of(true);
    }
    

  }



}