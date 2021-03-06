import { Injectable }     from '@angular/core';
import { CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route
} from '@angular/router';
import { AuthentificationService } from "../../services/authentification.service";
import { Observable } from "rxjs/Observable";



@Injectable()
export class AccueilGuard implements CanActivate, CanActivateChild  {

 constructor(private authService: AuthentificationService, private router: Router) {}
 
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
     let url: string = state.url;

      // si pas de token, id ou prénom stocké, accueil prospect accessible.
    if( (!localStorage.getItem('token')) || (!localStorage.getItem('id')) || (!localStorage.getItem('prenom')) ) { 
            return  Observable.of(true);
    }


    else if(this.authService.estConnecte().toPromise()) {
          // stocker l'url de redirection : l'accueil client (accueil prospect non accessible si connecté).
            this.router.navigate(['/accueil/cli']); 
            return  Observable.of(false);
          }

    else {
          // échec validation token : redirection vers accueil prospect.
          this.router.navigate(['/accueil']);
          return Observable.of(true);
    }

  }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
           return this.canActivate(route, state);  
    }


}