import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from "../../services/authentification.service";
import { Compte } from "../../objetmetier/compte";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-log-admin',
  templateUrl: './log-admin.component.html',
  styleUrls: ['./log-admin.component.css']
})
export class LogAdminComponent implements OnInit {

  private erreur:string = '';

  constructor(private authService:AuthentificationService, private router: Router) { }

  ngOnInit() {
  }


  private connecterAdmin(form:NgForm) : void {

      this.erreur ="";

      if((form.value.email=="") || (form.value.password=="")) {
          this.erreur = 'tous les champs doivent être renseignés.';
          setTimeout(() => { this.erreur = null; }, 2500);
      }
      else {
        let compte:Compte = new Compte();
        compte.email = form.value.email;
        compte.password = form.value.password;

          this.authService.connecterAdmin(compte)
                  .subscribe(res => sessionStorage.setItem('si',res),
                            err => { 
                              if(err.status == 400)
                                this.erreur = "les crédentiels saisis sont erronés.";
                              else if (err.status == 401)
                                this.erreur = "ce compte n'est pas autorisé à accéder à la plateforme d'administration.";
                              else {
                                this.erreur = "une erreur est survenue.";
                              }},
                            () => this.router.navigate(['/admin']));

        }

      }

}
