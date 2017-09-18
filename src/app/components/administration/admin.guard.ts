import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.autoriserAcces();
  }

  private autoriserAcces() : boolean {

    // ajouter vérif mw de la clef.
    if(sessionStorage.getItem('clef')) { return true;}

    else { this.router.navigate(['/admin/connexion']);
            return false;}

  }


}
