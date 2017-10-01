import { Component, OnInit } from '@angular/core';
import { CompteService } from "../../services/compte.service";
import { Compte } from "../../objetmetier/compte";
import { ClientService } from "../../services/client.service";
import { CompteDTO } from "../../objetmetier/compteDTO";
import { SelectItem, ConfirmationService, Message } from "primeng/primeng";
import { EstimationService } from '../../services/estimation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compte-admin',
  templateUrl: './compte-admin.component.html',
  styleUrls: ['./compte-admin.component.css','./administration-styles.css']
})
export class CompteAdminComponent implements OnInit {

  private totalClients : number;
  private totalClientsHommes : number;
  private totalClientsFemmes : number;

  private totalEstimations : number;
  private totalEstimGarcons : number;
  private totalEstimFilles : number;

  private donneesChartClients: any; // chart total client par sexe.
  private optionsChartClients: any; // options de la chart total client par sexe.
  private donneesChartEstimations: any; // chart total estimations par sexe.
  private optionsChartEstimations: any; // options de la chart total estimations par sexe.

  // Datatable :
  private listeComptesDTO:CompteDTO[] = [];
  private listeGenre: SelectItem[]; // filtre par sexe dans la datatable.
  private msgs: Message[] = []; // growl primeng

  constructor(private compteService:CompteService, private clientService:ClientService,private confirmationService: ConfirmationService, private estimationService:EstimationService, private router:Router) { }

  ngOnInit() {

    this.compteService.obtenirTousComptesDTO()
                      .subscribe(res => {this.listeComptesDTO=res;});

    this.obtenirTotauxClientsEtChart();
    this.obtenirTotalEstimations();
    this.peuplerFiltreGenre();

  }

  /**
   * 1. méthode globale : obtenir le nombre total de clients inscrits
   * puis lancer l'obtention du nombre de clients par genre
   *  
   */
  private obtenirTotauxClientsEtChart() : void {

    // à voir si supprimer : on peut le faire à partir de this.listeComptesDTO.length
    this.clientService.obtenirTotalClients()
    .subscribe(res => this.totalClients = res,
                err => console.log(err._body),
                () => this.obtenirTotauxClientsParSexe());
    
    }
  
  /**
   * 2. méthode consécutive à obtenirTotauxClientsEtChart() :
   *  obtenir le nombre d'hommes inscrits
   *  totalClients - totalHommes = totalFemmes
   *  une fois ces stats obtenues, construire la chart.
   * 
   */
  private obtenirTotauxClientsParSexe() : void {

    this.clientService.obtenirTotalClientsParSexe("1")
    .subscribe(res => {this.totalClientsHommes=res;
                       this.totalClientsFemmes = this.totalClients-this.totalClientsHommes;},
              err => { if(err.status == 401) {
                          sessionStorage.clear();
                          this.router.navigate(['/admin-connexion']);
                          alert(err._body);
                      }
              },
              () => {this.construireChartTotalClients()});
  }

  /**
   * 3. construire la chart "répartition clients par genre"
   * 
   */
  private construireChartTotalClients() : void {

    this.donneesChartClients = {
      labels: ["Hommes","Femmes"],
      datasets: [{
        data: [ this.totalClientsHommes,this.totalClientsFemmes],
          backgroundColor: [
            "#1e9ecc",
            "#eb505f"
          ],
          hoverBackgroundColor: [
            "#4ac2f4",
            "#f1717e"
        ]
      }],
    };

    this.optionsChartClients = {
      title: {
          display: true,
          text: 'répartition CLIENTS par genre',
          fontSize: 16
      },
      legend: {
          position: 'bottom'
      }
  };

  }

    /**
   * obtenir le nombre total d'estimations dans la bdd
   * 
   */
  private obtenirTotalEstimations() : void {
    
    this.estimationService.obtenirTotalEstimations()
                          .subscribe ( res => {this.totalEstimations = res;this.obtenirTotalEstimationsParSexe()});
  }

  private obtenirTotalEstimationsParSexe() : void {

    this.estimationService.obtenirTotalEstimationsParSexe("1")
                          .subscribe ( res => this.totalEstimGarcons = res,
                                        err => console.log(err._body),
                                        () => { this.totalEstimFilles = this.totalEstimations - this.totalEstimGarcons;
                                                this.construireChartTotalEstimations(); })

  }

  private construireChartTotalEstimations() : void {
    
        this.donneesChartEstimations = {
          labels: ["Garçons","Filles"],
          datasets: [{
            data: [ this.totalEstimGarcons,this.totalEstimFilles],
              backgroundColor: [
                "#4E81B6",
                "#4ac2f4"
              ],
            //   hoverBackgroundColor: [
            //     "#4ac2f4",
            //     "#f1717e"
            // ]
          }],
        };
    
        this.optionsChartEstimations = {
          title: {
              display: true,
              text: 'répartition ESTIMATIONS par genre',
              fontSize: 16
          },
          legend: {
              position: 'bottom'
          }
      };
    
      }


  /** 
   * dropdown choix du filtre par genre dans la datatable.
   * tous, hommes ou femmes.
   */    
  private peuplerFiltreGenre() : void {
    
    this.listeGenre = [];
    this.listeGenre.push({label: 'tous', value: null});
    this.listeGenre.push({label: 'homme', value: '1'});
    this.listeGenre.push({label: 'femme', value: '2'});
  }
  
  /**
   * méthode de confirmDialog PrimeNg.
   * si confirmation, appeler la méthode supprimerCompte(compteDTO)
   * 
   * @param compteDTO 
   */
  private confirmerSuppression(compteDTO:CompteDTO) : void {

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de supprimer ce compte ? L\'opération est irréversible.',
      header: 'Confirmation de suppression',
      icon: 'fa fa-trash',
      accept: () => {
          this.supprimerCompte(compteDTO);
      }
    })
  }

  /**
   * supprimer un compte et toutes les estimations liées.
   * 
   * @param compteDTO 
   */
  private supprimerCompte(compteDTO:CompteDTO) {

      this.compteService.supprimerCompteEtEstimations(compteDTO)
                        .subscribe(res => {
                            // retirer le compte de la liste sans repasser par le serveur.
                            for (let compte of this.listeComptesDTO) {
                                  this.listeComptesDTO = this.listeComptesDTO.filter(item => item != compteDTO )  
                            }
                        },
                        err => {this.msgs = [],
                                this.msgs.push({severity:'info', summary:'erreur', detail:err._body});},
                        () => { this.msgs = [],
                                this.msgs.push({severity:'info', summary:compteDTO.email, detail:'compte supprimé avec succès'});
                                this.rechargerDonnees();
                        })

  }

  /**
   * méthode pour recharger les stats après suppression de compte.
   * 
   */
  private rechargerDonnees() : void {

      this.obtenirTotauxClientsEtChart();
      this.obtenirTotalEstimations();

  }


}
