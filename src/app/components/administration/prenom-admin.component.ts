import { Component, OnInit } from '@angular/core';
import { PrenomInsee } from '../../objetmetier/prenominsee';
import { PrenomService } from '../../services/prenom.service';

@Component({
  selector: 'app-estimation-admin',
  templateUrl: './prenom-admin.component.html',
  styleUrls: ['./prenom-admin.component.css']
})
export class PrenomAdminComponent implements OnInit {

  private saisieRecherche : string;
  private choixSexe : string ='1'; //bouton radio : valeur par défaut sur garçon.

  private totalNaissances : number = 0;
  private maxNaissances : PrenomInsee[] = [];
  private listeStatsPrenom : PrenomInsee[] = []; // datatable

  
  private messageEchec : string;


  constructor(private prenomService:PrenomService) { }

  ngOnInit() {

    

  }

  /**
   * méthode globale qui lance la recherche à partir de la saisie.
   * 
   */
  private chercherPrenom() : void {

    this.obtenirStatsInseePrenom();

  }


  private obtenirStatsInseePrenom() : void {

    this.messageEchec='';

    this.prenomService.obtenirStatsInseePrenom(this.saisieRecherche,this.choixSexe)
                      .subscribe(res => { 
                        if(res == 204) {
                          this.messageEchec = "aucun prénom trouvé pour cette saisie.";
                        }
                        else {
                          this.listeStatsPrenom=res;
                          this.obtenirTotalNaissances();
                          this.obtenirMaxNaissancesPourUnPrenom();
                        }
                        },
                        err => this.messageEchec = err._body)
                     
    }

  private obtenirTotalNaissances(): number{

      console.dir(this.listeStatsPrenom);

      for (let prenomInsee of this.listeStatsPrenom){
          
        this.totalNaissances += prenomInsee.nombreNaissances;
      }
      console.log(this.totalNaissances);
      return this.totalNaissances;
  }

  private obtenirMaxNaissancesPourUnPrenom() : void {

      this.prenomService.obtenirMaxNaissancesPourUnPrenom(this.saisieRecherche.toUpperCase(),this.choixSexe)
                        .subscribe(res =>this.maxNaissances = res));
  }

}
