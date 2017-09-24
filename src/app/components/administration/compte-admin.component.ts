import { Component, OnInit } from '@angular/core';
import { CompteService } from "../../services/compte.service";
import { Compte } from "../../objetmetier/compte";
import { ClientService } from "../../services/client.service";
import { CompteDTO } from "../../objetmetier/compteDTO";
import { SelectItem, ConfirmationService, Message } from "primeng/primeng";

@Component({
  selector: 'app-compte-admin',
  templateUrl: './compte-admin.component.html',
  styleUrls: ['./compte-admin.component.css']
})
export class CompteAdminComponent implements OnInit {

  private totalClients : number;
  private totalClientsHomme : number;
  private totalClientsFemme : number;

  donneesChartClients: any; // chart total client par sexe.
  options: any; // optiosn de la chart total client par sexe.

  listeComptes:Compte[] = [];
  listeComptesDTO:CompteDTO[] = [];
  listeGenre: SelectItem[]; // filtre par sexe dans la datatable.
  msgs: Message[] = []; // growl primeng

  constructor(private compteService:CompteService, private clientService:ClientService,private confirmationService: ConfirmationService) { }

  ngOnInit() {

    this.compteService.obtenirTousComptesDTO()
                      .subscribe(res => {this.listeComptesDTO=res;});

    this.obtenirTotauxClientsEtChart();
    this.peuplerFiltreGenre();

  }



  private obtenirTotauxClientsEtChart() : void {

    // à voir si supprimer : on peut le faire à partir de this.listeComptesDTO.length
    this.clientService.obtenirTotalClients()
    .subscribe(res => this.totalClients = res,
                err => console.log(err._body),
                () => this.obtenirTotauxClientsParSexe());
    
    }

  private obtenirTotauxClientsParSexe() : void {

    this.clientService.obtenirTotalClientsParSexe("1")
    .subscribe(res => {this.totalClientsHomme=res;
                       this.totalClientsFemme = this.totalClients-this.totalClientsHomme;},
              err => console.log(err),
              () => {this.construireChartTotalClients()});
  }

  private construireChartTotalClients() : void {

    this.donneesChartClients = {
      labels: ["Hommes","Femmes"],
      datasets: [{
        data: [ this.totalClientsHomme,this.totalClientsFemme],
          backgroundColor: [
            "#1e9ecc",
            "#eb505f"
          ]
      }],
    };

    this.options = {
      title: {
          display: true,
          text: 'Proportion hommes/femmes',
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


  private supprimerCompte(compteDTO:CompteDTO) {

      this.compteService.supprimerCompteEtEstimations(compteDTO)
                        .subscribe(res => {
                            // retirer le compte de la liste sans repasser par le serveur.
                            for (let compte of this.listeComptesDTO) {
                                  this.listeComptesDTO = this.listeComptesDTO.filter(item => item != compteDTO )  
                            }
                        },
                        err => console.log(err._body + " "),
                        () => {this.msgs = [],
                                this.msgs.push({severity:'info', summary:compteDTO.email, detail:'compte supprimé avec succès'});
                                this.rechargerDonnees();
                        })

  }

  private rechargerDonnees() : void {

      this.obtenirTotauxClientsEtChart();

  }


}
