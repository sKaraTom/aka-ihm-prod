import { Component, OnInit } from '@angular/core';
import { PrenomInsee } from '../../objetmetier/prenominsee';
import { PrenomService } from '../../services/prenom.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-estimation-admin',
  templateUrl: './prenom-admin.component.html',
  styleUrls: ['./prenom-admin.component.css','./administration-styles.css']
})
export class PrenomAdminComponent implements OnInit {

  private saisieRecherche : string;
  private choixSexe : string ='1'; //bouton radio : valeur par défaut sur garçon.

  private totalNaissances : number = 0;
  private maxNaissances : PrenomInsee[] = [];
  private listeStatsPrenom : PrenomInsee[] = []; // datatable

  
  private messageEchec : string;


  constructor(private prenomService:PrenomService, private router:Router) { }

  ngOnInit() {

  }


  /**
   * méthode globale qui lance la recherche à partir de la saisie.
   * 1.obtenir toutes les stats du prénom pour un sexe donné.
   * 2. obtenir le total de naissances du prénom depuis 1900
   * 3. obtenir les années où il y a eu le + de naissances pour ce prénom.
   */
  private chercherPrenom() : void {

    this.messageEchec='';
    this.listeStatsPrenom = [];

    if(this.validerSaisie(this.saisieRecherche)) {
        
      this.prenomService.obtenirStatsInseePrenom(this.saisieRecherche,this.choixSexe)
                          .subscribe(res => { 
                            if(res == 204) {
                              this.messageEchec = "aucun prénom trouvé pour cette saisie.";
                            }
                            else {
                              this.listeStatsPrenom=res;
                              this.obtenirTotalNaissances();
                            }
                            },
                            err => {
                              if(err.status == 401) {
                                sessionStorage.clear();
                                this.router.navigate(['/admin/connexion']);
                              }
                              else {
                              this.messageEchec = err._body;
                              }});
      this.obtenirMaxNaissancesPourUnPrenom();
    }
  }

  /**
   * obtenir le total de naissances depuis 1900 pour un prénom et un sexe donnés.
   * le calcul se fait depuis les stats chargées dans this.listeStatsPrenom
   * pour éviter de rappeler le mw. 
   */
  private obtenirTotalNaissances() {

    this.totalNaissances = 0;

    for (let prenomInsee of this.listeStatsPrenom){
        
      this.totalNaissances += prenomInsee.nombreNaissances;
    }
    
  }

  /**
   * obtenir les années où il y a eu le + de naissances pour un prénom donné.
   * @return PrenomInsee[] maxNaissances
   */
  private obtenirMaxNaissancesPourUnPrenom() : void {

      this.prenomService.obtenirAnneesMaxNaissancesPourUnPrenom(this.saisieRecherche.toUpperCase(),this.choixSexe)
                        .subscribe(res =>this.maxNaissances = res);
  }


 /**
     * valider que la saisie est conforme
     * 
     * @param saisie
     * @return booleen true si valide.
     */
    private validerSaisie (saisie:string) : boolean {
      
       // si la saisie est vide ou ne contient que des espaces.
      if(!saisie || !saisie.trim()) {
          this.messageEchec = "vous devez saisir un prénom pour effectuer une recherche.";
          return false;
      }

      else {
          return true;
      }

    }
}