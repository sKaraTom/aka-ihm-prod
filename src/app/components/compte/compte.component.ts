

import { Component, OnInit } from "@angular/core";
import { AuthentificationService } from "../../services/authentification.service";
import { Router } from "@angular/router";
import { CompteService } from "../../services/compte.service";
import { ClientService } from "../../services/client.service";
import { Client } from "../../objetmetier/client";
import { NgForm } from "@angular/forms";
import { Compte } from "../../objetmetier/compte";
import { EstimationService } from "../../services/estimation.service";
import { ConfirmationService, Message } from "primeng/primeng";

@Component({
  templateUrl :'./compte.component.html',
  styleUrls: ['./compte.component.css'],
})

export class CompteComponent implements OnInit {

    private idClient:string;

    // ref infos client reçues
    private client:Client;
    private emailRef :string

    // client à modifier
    private prenom:string;
    private genre:string;

    private modifMdpActive : boolean = false;


    //messages erreur-succès
    erreurModif:string;
    modifReussie:boolean = false;
    succesModifMdp:string;

     msgs: Message[] = []; // growl primeng

    constructor(
      public authService:AuthentificationService,
      public router: Router,
      public compteService:CompteService,
      public clientService:ClientService,
      public estimationService:EstimationService,
      private confirmationService: ConfirmationService
    ){
      this.client = new Client();

      this.authService.idClientSource.next(localStorage.getItem('id'));


    }
   
    ngOnInit(): void {
           if (!localStorage.getItem('token')) {
          this.authService.idClientSource.next(null);
       }
       
      this.authService.idClientObs.subscribe(
        res => {
          if(res) {  this.idClient = res;    }
          else {     this.idClient = null;   }
        })
   
        this.obtenirClient();
    }


private obtenirClient() {
    // Client est la ref, les variables prenom et genre sont les variables qui seront modifiables.
    this.clientService.obtenirClient(this.idClient).subscribe(res =>  {this.client = res},
                                                              err => {},
                                                              () => { this.emailRef = this.client.compte.email;
                                                                      this.prenom = this.client.prenom;
                                                                      this.genre = this.client.sexe;} );

}


public deconnecter(event:Event):void {
  event.preventDefault();
  this.authService.deconnecter();
  this.idClient = null;
  this.router.navigateByUrl('/accueil');
  event.stopPropagation();
}

/** modifier les informations du client lié à un compte.
 * 
 * @param form (prenom, sexe, et mot de passe)
 */
public modifierCompte(form:NgForm):void {
  
    //si formulaire validé, envoyer un nouveau compte (avec client lié) au mw.
    if(this.validerFormulaire(form)) {

        // à partir du formulaire, recréer un compte/client à envoyer côté mw pour update.
        let compte = new Compte();
        let clientModifie = new Client();
        
        compte.email = this.client.compte.email; // l'email n'est pas éditable (clef primaire).
                                                // on le définie à compte.email pour binder la modif avec le compte en bdd.
        compte.password = form.value.mdp;
        
        clientModifie.prenom = form.value.prenom;
        clientModifie.sexe = form.value.genre;
        clientModifie.uuid = this.idClient;
        compte.client = clientModifie;

        this.compteService.modifierCompte(compte)
            .subscribe(res => { 
                                // si le prénom est modifié, mettre à jour le local storage et variable globale.
                                if((localStorage.getItem('prenom').toUpperCase()) != (clientModifie.prenom.toUpperCase())){
                                  //on formate le prénom pour mettre à jour directement le prénom côté ihm
                                  let prenomFormate =  clientModifie.prenom.charAt(0).toUpperCase() + form.value.prenom.slice(1);
                                  localStorage.setItem('prenom',prenomFormate);
                                  this.authService.prenomClientSource.next(prenomFormate);
                                }
                                // mettre à jour la ref client.
                                this.client.prenom = this.prenom;
                                this.client.sexe=this.genre;},
                      err => { this.erreurModif = err._body;
                                setTimeout(() => { this.erreurModif = null; }, 3000); 
                      },
                      () => {this.modifReussie = true;  setTimeout(() => { this.modifReussie = null; }, 4000); }
                      );
    }
}

/** formulaire de changement de mot de passe
 * 
 * @param formMdp (mot de passe actuel, nouveau, et confirmation)
 */
private modifierMotDePasse(formMdp:NgForm):void {

    let email = this.emailRef;
    let passwordActuel = formMdp.value.mdpActuel;
    let nouveauPassword = formMdp.value.mdpNouveau;

    if(this.validerFormulaireMdp(formMdp)) {

      this.compteService.modifierMotDePasse(email,passwordActuel,nouveauPassword)
              .subscribe(res =>{ this.succesModifMdp = res;
                              setTimeout(() => { this.succesModifMdp = null; }, 4000);
                              formMdp.resetForm();
                              },
                          err => { 
                              this.erreurModif = err._body;
                              setTimeout(() => { this.erreurModif = null; }, 4000);
                              }
                         );
    }
}

 private confirmSuppressionToutesEstimations() : void {
        this.confirmationService.confirm({
            message: 'Attention : tous vos prénoms estimés seront effacés.',
            accept: () => { this.supprimerToutesEstimations(); }
        });
    }


private supprimerToutesEstimations() : void {
    this.estimationService.supprimerToutesEstimationsClient(this.idClient)
                .subscribe(res => {},
                err => {},
                () => {
                    this.msgs = [],
                    this.msgs.push({severity:'info', summary:'Remise à zéro effectuée', detail:'Vous pouvez recommencer votre recherche.'})
                });
}

/** annuler la modification du compte
 *  Remettre le prenom et genre à leur valeur de référence.
 *  vider le champ du mot de passe.
 * @param form 
 */
private annulerModif(form:NgForm) :void {
      this.prenom = this.client.prenom;
      this.genre = this.client.sexe;
      form.controls['mdp'].setValue(""); // pour vider le champs mot de passe du formulaire sans ngModel
}


/** annuler le formulaire de modif du mot de passe.
 *  retirer le formulaire de la vue (booleen) et vider les saisies.
 * @param formMdp 
 */
private annulerModifMotDePasse(formMdp:NgForm) : void {
    formMdp.resetForm();
    this.modifMdpActive = false;
}


/** valider le formulaire de modification du compte : 
 * 
 * @param formulaire (prénom, genre et mot de passe)
 * @return true si validé.
 */
 private validerFormulaire(formulaire:NgForm) : boolean {

        let nouveauPrenom = formulaire.value.prenom;
        let nouveauSexe = formulaire.value.genre;

        // si le prénom ou le sexe n'a pas changé - message qu'il n'y a pas de modification effectuée.
        if( (this.client.prenom == nouveauPrenom) && (this.client.sexe == nouveauSexe) ) {
            this.erreurModif = "Aucun champ modifié.";
            setTimeout(() => { this.erreurModif = null; }, 4000);
            return false;
        }

        // si le mdp saisi contient des espaces.
        else if(this.contenirEspaces(formulaire.value.mdp)) {
            this.erreurModif = "le mot de passe ne doit pas contenir d'espace.";
            setTimeout(() => { this.erreurModif = null; }, 4000);
            return false;
        }

        // si le nouveau prénom saisi contient des espaces.
        else if(this.contenirEspaces(nouveauPrenom)) {
            this.erreurModif = "le prenom ne doit pas contenir d'espace.";
            setTimeout(() => { this.erreurModif = null; }, 4000);
            return false;
        }

          return true;

      }

/** valider le formulaire de changement de mot de passe
 * 
 * @param formMdp (password actuel, nouveau et celui de confirmation)
 * @return true si validé.
 */
private validerFormulaireMdp(formMdp:NgForm) : boolean {

        let passwordActuel:string = formMdp.value.mdpActuel;
        let nouveauPassword:string = formMdp.value.mdpNouveau;
        let confirmPassword:string = formMdp.value.mdpConfirm;

        // vérifier que les 2 champs mdp matchent.
          if(nouveauPassword != confirmPassword) {
            this.erreurModif = "le mot de passe de confirmation doit correspondre au nouveau mot de passe.";
            setTimeout(() => { this.erreurModif = null; }, 4000); 
            return false;
          }
          
        // si le nouveau mot de passe contient des espaces.
          else if(this.contenirEspaces(nouveauPassword)) {
            this.erreurModif = "le mot de passe ne doit pas contenir d'espace.";
            setTimeout(() => { this.erreurModif = null; }, 4000);
            return false;
          }
          
          // si le nouveau password est identique à l'actuel.
          else if (passwordActuel == nouveauPassword) {
              this.erreurModif = "le nouveau mot de passe doit être différent de l'actuel.";
              setTimeout(() => { this.erreurModif = null; }, 4000);
              return false;
          }
          return true;
      }

       private contenirEspaces(mot:string):boolean {
             return /\s/g.test(mot);
       }


}