import { Component, OnInit } from '@angular/core';
import { CompteService } from "../../services/compte.service";
import { Compte } from "../../objetmetier/compte";
import { ClientService } from "../../services/client.service";
import { CompteDTO } from "../../objetmetier/compteDTO";
import { SelectItem } from "primeng/primeng";

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
  listeGenre: SelectItem[]; // filtre par sexe dans la datatable.

  constructor(private compteService:CompteService, private clientService:ClientService) { }

  ngOnInit() {

    this.compteService.obtenirTousComptes()
                      .subscribe(res => this.listeComptes=res);
    
    this.compteService.obtenirTousComptesDTO()
                      .subscribe(res => {this.listeComptesDTO=res; console.dir(res)});

    this.obtenirTotauxClientsEtChart();
    this.peuplerFiltreGenre();

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

    /** 
     * dropdown choix du filtre par genre dans la datatable.
     * tous, hommes ou femmes.
     */    
    private peuplerFiltreGenre() : void {
      
      this.listeGenre = [];
      this.listeGenre.push({label: 'tous', value: null});
      this.listeGenre.push({label: 'homme', value: '1'});
      this.listeGenre.push({label: 'femme', value: '2'});
      console.dir(this.listeGenre);
  }
  
  private supprimerCompte(event,email:string) {

      console.log(email);

  }

}
