


import { OnInit, Component } from "@angular/core";
import { Compte } from "../../objetmetier/compte";
import { NgForm } from "@angular/forms";
import { Client } from "../../objetmetier/client";
import { AuthentificationService } from "../../services/authentification.service";
import { Router } from "@angular/router";
import { LoginComponent } from "./login.component";
import { CompteService } from "../../services/compte.service";

@Component({
  selector:'inscription',
  templateUrl : './inscription.component.html',
  styleUrls: ['./login.component.css']
})
export class InscriptionComponent implements OnInit {
        
        compteInscription:Compte;
        client:Client;

        erreur:string;
        inscriptionReussie:boolean = false;


        constructor(public authService: AuthentificationService,
                    public compteService: CompteService,
                    public router: Router,
                    public loginComponent:LoginComponent) {
          this.compteInscription = new Compte();
          this.client = new Client();
        }


        ngOnInit(): void {
            
        }


      /**
       * créer un compte.
       */
       public creerCompte(formInscription:NgForm) : void {
          
              // si le formulaire a ses champs validés, compte à créer envoyé au mw.
              if(this.validerFormulaire(formInscription)) {

                    // charger un compte compteInscription depuis le formulaire.
                    this.compteInscription.email = formInscription.value.email;
                    this.compteInscription.password = formInscription.value.mdp;
                    
                    this.client.prenom = formInscription.value.prenom.trim(); // supprimer les espaces superflus.
                    this.client.sexe = formInscription.value.genre;
                    
                    this.compteInscription.client = this.client;

                    this.compteService.creerCompte(this.compteInscription)
                                .subscribe(
                                  res => {},
                                  err => { 
                                          if(err.status == 409) {
                                            this.erreur = "un compte existe déjà pour cet email.";
                                            setTimeout(() => { this.erreur = null; }, 4000); 
                                          }
                                          else if(err.status == 400) {
                                            this.erreur = "tous les champs doivent être renseignés.";
                                              setTimeout(() => { this.erreur = null; }, 4000); 
                                          }
                                          else if(err.status == 406) {
                                            this.erreur = "l'email doit être valide.";
                                              setTimeout(() => { this.erreur = null; }, 4000); 
                                          }
                                          else {
                                            this.erreur = "un problème a eu lieu à l'inscription.";
                                              setTimeout(() => { this.erreur = null; }, 4000); 
                                          }
                                  },
                                  () => {this.inscriptionReussie = true;
                                          formInscription.resetForm(); }
                                )
              }
          }           
        
      /**
       * valider que le formulaire a des saisies valides.
       * 
       * @param formulaire 
       */
      private validerFormulaire(formulaire:NgForm) : boolean {

        // vérifier que les 2 champs mdp matchent.
          if(formulaire.value.mdp != formulaire.value.mdpConfirm) {
            this.erreur = "les deux champs mots de passe doivent correspondre.";
            setTimeout(() => { this.erreur = null; }, 3000); 
            return false;
          }
          
        // si le password contient des espaces, message d'erreur.
          else if(this.contenirEspaces(formulaire.value.mdp)) {
            this.erreur = "le mot de passe ne doit pas contenir d'espace.";
            setTimeout(() => { this.erreur = null; }, 3000);
            return false;
          }
          return true;

      }

      /**
       * valider qu'une string ne contient pas d'espace.
       * 
       * @param mot
       * @return booleen true si le mot contient des espaces.
       */
      private contenirEspaces(mot:string):boolean {
             return /\s/g.test(mot);
      }

      /**
       * méthode de redirection :
       * -  vers la page de login si l'on est sur la page /inscription.
       * - remonter vers le haut de la page si l'on est dans la partie basse de la page /login.
       */
      public redirigerVersPageLogin() : void {
          
          if (this.router.url == '/login') {
              window.scrollTo(0,0);
              this.loginComponent.afficherInscription();
          }
          else {
              this.router.navigateByUrl('/login');
        }
      }

}