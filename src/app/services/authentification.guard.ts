

import { Injectable }     from '@angular/core';
import { CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild, NavigationExtras, Route
} from '@angular/router';
import { AuthentificationService } from "./authentification.service";
import { Observable } from "rxjs/Observable";
import { HeaderComponent } from "../components/header/header.component";


@Injectable()
export class AuthentificationGuard implements CanActivate, CanActivateChild  {

 constructor(private authService: AuthentificationService, private router: Router) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

          return this.checkLogin();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
           
          return this.canActivate(route, state);  
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
  checkLogin(): Observable<boolean> {

    if( (localStorage.getItem('token')) && (localStorage.getItem('id')) && (localStorage.getItem('prenom')) ) { 
          
          // si token validé :navigation autorisée.
          if(this.authService.estConnecte().toPromise()) {
                return  Observable.of(true);
          }

          else {
                // échec valid' token : redirection vers page de login.
                this.authService.prenomClientSource.next(null);
                this.router.navigate(['/login']);
                return Observable.of(false);
          }

    }

    else {
        // pas de localstorage : redirection vers page de login.
        this.router.navigate(['/login']);
        return Observable.of(false);
    }
    

  }

}