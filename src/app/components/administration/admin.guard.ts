import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthentificationService } from "../../services/authentification.service";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService:AuthentificationService,private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.autoriserAcces();
  }

  /**
   * accès interface admin : si le sessionStorage est chargé et le token validé.
   * 
   */
  private autoriserAcces() : boolean {

    if(sessionStorage.getItem('si') && this.authService.estConnecteAdmin().toPromise() ) { 
        return true;
    }

    else { 
        this.router.navigate(['/admin/connexion']);
        return false;
    }

  }


}
