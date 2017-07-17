
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AuthentificationService } from "../../services/authentification.service";
import { CompteService } from "../../services/compte.service";



@Component({
  templateUrl : './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
   
  private password: string;
  private email: string;
  private idClient:string;
  
  private inscriptionAffichee:boolean = false;

  message: string;
  error = '';
  
  
  constructor(public authService: AuthentificationService,
              public compteService: CompteService,
              public router: Router) {
    this.authService.idClientSource.next(localStorage.getItem('id'));
    // this.inscriptionAffichee = false;
  }

 ngOnInit(): void {
        if (!localStorage.getItem('token')) {
          this.authService.idClientSource.next(null);
       }
       
      this.authService.idClientObs.subscribe(
        res => {
          if(res) {
            this.idClient = res;
          }
          else {
            this.idClient = null;
          }
        })
       

    }

public connecter(event:Event):void {

   event.preventDefault();

   if((this.email=="") || (this.password=="")) {
      this.error = 'tous les champs doivent être renseignés.';
      setTimeout(() => { this.error = null; }, 2500);
   }
   else {
   this.authService.connecter(this.email, this.password)
            .subscribe(result => {
                    let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/accueil/cli';
                    this.router.navigate([redirect]);
                    this.password = null;
                    this.email = null;    
                },
                err => { this.error = 'Email ou mot de passe incorrect.';
                  setTimeout(() => { this.error = null; }, 2500); 
                }
            );
    }
    event.stopPropagation();
}


public afficherInscription() : void {
       
        if(this.inscriptionAffichee) {
          this.inscriptionAffichee = false;
        }
        else {
          this.inscriptionAffichee = true;
        }
}
  
}