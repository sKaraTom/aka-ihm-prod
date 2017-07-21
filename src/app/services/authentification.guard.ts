

import { Injectable }     from '@angular/core';
import { CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route
} from '@angular/router';
import { AuthentificationService } from "./authentification.service";
import { Observable } from "rxjs/Observable";


@Injectable()
export class AuthentificationGuard implements CanActivate, CanActivateChild, CanLoad  {

 constructor(private authService: AuthentificationService, private router: Router) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url: string = state.url;

    return this.checkLogin(url);
  }


  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
           
           return this.canActivate(route, state);  
  }

  canLoad(route: Route): Observable<boolean> {
      let url = `/${route.path}`;

      return this.checkLogin(url);
  }

  
  
  /**
   * vérifier que le compte est connecté :
   * - si localStorage contient le token, id et prénom.
   * - si le token est valide.
   * - redirection vers page login si échec.
   * 
   * @param url
   * @return boolean si compte connecté et valide.
   */
  checkLogin(url: string): Observable<boolean> {

    if( (localStorage.getItem('token')) && (localStorage.getItem('id')) && (localStorage.getItem('prenom')) ) { 
          
          // si token validé :navigation autorisée.
          if(this.authService.estConnecte().toPromise()) {
            return  Observable.of(true);
          }

          else {
                this.authService.redirectUrl = url;
                // échec valid' token : redirection vers page de login.
                this.authService.prenomClientSource.next(null);
                this.router.navigate(['/login']);
                return Observable.of(false);
          }

    }

    else {
        this.authService.redirectUrl = url;
        // pas de localstorage : redirection vers page de login.
        this.router.navigate(['/login']);
        return Observable.of(false);
    }
    

  }

}