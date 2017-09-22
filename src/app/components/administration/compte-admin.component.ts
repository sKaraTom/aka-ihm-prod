import { Component, OnInit } from '@angular/core';
import { CompteService } from "../../services/compte.service";
import { Compte } from "../../objetmetier/compte";
import { ClientService } from "../../services/client.service";
import { CompteDTO } from "../../objetmetier/compteDTO";

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

  listeComptes:Compte[] = [];
  listeComptesDTO:CompteDTO[] = [];

  constructor(private compteService:CompteService, private clientService:ClientService) { }

  ngOnInit() {

    this.compteService.obtenirTousComptes()
                      .subscribe(res => this.listeComptes=res);
    
    this.compteService.obtenirTousComptesDTO()
                      .subscribe(res => {this.listeComptesDTO=res; console.dir(res)});

    this.obtenirTotauxClientsEtChart();

  }



  private obtenirTotauxClientsEtChart() : void {

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
      datasets: [{
          data: [ this.totalClientsHomme,this.totalClientsFemme],
          backgroundColor: [
            "#1e9ecc",
            "#eb505f"
          ],
          label: 'My dataset'
      }],
      labels: [
          "Hommes",
          "Femmes",
      ]
  }
  }


}
