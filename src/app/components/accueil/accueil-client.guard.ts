import { Injectable }     from '@angular/core';
import { CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route
} from '@angular/router';
import { AuthentificationService } from "../../services/authentification.service";
import { Observable } from "rxjs/Observable";



@Injectable()
export class AccueilClientGuard implements CanActivate, CanActivateChild, CanLoad  {

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

 /**
   * vérifier que le compte est connecté :
   * - si localStorage contient le token, id et prénom.
   * - si le token est valide.
   * - redirection vers page accueil prospect si échec.
   * 
   * @param url
   * @return boolean si compte connecté et valide.
   */
  checkLogin(url: string): Observable<boolean> {

      if( (localStorage.getItem('token')) && (localStorage.getItem('id')) && (localStorage.getItem('prenom')) ) { 
          
          // si token validé : accès accueil client autorisé.
          if(this.authService.estConnecte().toPromise()) {
            return  Observable.of(true);
          }

          else {
               this.authService.redirectUrl = url;
                // échec valid' token : redirection vers page d'accueil prospect.
                this.router.navigate(['/accueil']);
                return Observable.of(false);
          }

      }

    else {
        this.authService.redirectUrl = url;
        // pas de localstorage : redirection vers page d'accueil prospect.
        this.router.navigate(['/accueil']);
        return Observable.of(false);
    }
    

  }



}