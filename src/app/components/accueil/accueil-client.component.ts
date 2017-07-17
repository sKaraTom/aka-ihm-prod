
import { Component, OnInit } from "@angular/core";

import { Http } from "@angular/http";
import { Router } from "@angular/router";

import { AuthentificationService } from "../../services/authentification.service";
import { EstimationService } from "../../services/estimation.service";
import { ClientService } from "../../services/client.service";
import { Estimation } from "../../objetmetier/estimation";
import { Citation } from "../../objetmetier/citation";
import { CitationService } from "../../services/citation.service";




@Component({
     templateUrl : './accueil-client.component.html',
    styleUrls: ['./accueil-client.component.css']
})
export class AccueilClientComponent implements OnInit {

            private uuidClient:string;

            //stats générales
            private totalEstimations:number;
            private totalClients:number;
            private top3Garcons:Array<String>;
            private top3Filles:Array<String>;

            //stats client
            private totalEstimationsClient : number;
            private totalEstimFillesClient :number;
            private totalEstimGarconsClient:number;

            listeFavoris:Array<Estimation>;

            prenomClient:string;

            // personnaliser le bonjour/bonsoir en fonction de l'heure de la journée.
            heure:number;
            bonjourOuBonsoir:string = "onjour";

            //chart donut
            data: any;

            // si pas encore de prénoms estimés.
            statsEstimsVide:boolean = false;

    constructor(
        private router: Router,
        private http: Http,
        private estimationService: EstimationService,
        private authService:AuthentificationService,
        private clientService:ClientService,
        private citationService:CitationService,

  ) {
    this.top3Garcons = new Array<String>();
    this.top3Filles = new Array<String>();

    this.ecrireMessageBonjour();
  
    this.authService.idClientObs.subscribe(
        res => {
          if(res) {
            this.uuidClient = res;
          }
          else {
            this.uuidClient = null;
          }
        })

     this.construireDonutChart();
     this.obtenirListeFavoris();
    
  }
       
        ngOnInit(): void {
      
        this.authService.prenomClientObs.subscribe(
        res => { if(res) { this.prenomClient = res; }
                 else { this.prenomClient = null;  }
        })

        this.obtenirNbreEstimsClient();
        
        this.obtenirTop3GarconsFilles();
        this.obtenirTotalEstimations();
        this.obtenirTotalClients();

        }


      private ecrireMessageBonjour() {

            let today = new Date();
        this.heure = today.getHours();
        if((this.heure > 19) || (this.heure < 4)) {
            this.bonjourOuBonsoir = "onsoir";
        }
        else {
          this.bonjourOuBonsoir = "onjour";
        }
      }

      

      private obtenirListeFavoris() {
           
           this.clientService.obtenirListeFavoris(this.uuidClient)
                                .subscribe(liste => this.listeFavoris = liste,
                                err => {},
                                () => {
                                  //fonction pour trier la liste par ordre alphabétique (prenom)
                                  this.listeFavoris.sort((a,b) => {
                                   if (a.prenom < b.prenom)
                                      return -1;
                                    if (a.prenom > b.prenom)
                                      return 1;
                                    // a doit être égal à b
                                    return 0;
                                  }
                                  )
                                }
                                );
      }

      // ********PARTIE STATS CLIENT********

      private obtenirNbreEstimsClient() {
           this.estimationService.obtenirTotalEstimClient(this.uuidClient).subscribe(
                  res => this.totalEstimationsClient = res
            );
            if (this.totalEstimationsClient == null) {
              this.totalEstimationsClient = 0;
            }
      }

      // ********PARTIE STATS GENERALES********
      
      private obtenirTop3GarconsFilles() {
            this.estimationService.obtenirTop3Estimations("1")
                                .subscribe(res => this.top3Garcons = res );
            this.estimationService.obtenirTop3Estimations("2")
                                .subscribe(res => this.top3Filles = res );

      }

      
      private obtenirTotalClients() : void {
         this.clientService.obtenirTotalClients()
                          .subscribe(res => this.totalClients=res);
      }

      private obtenirTotalEstimations() : void {
        this.estimationService.obtenirTotalEstimations()
                    .subscribe ( res => this.totalEstimations = res)
        }



      // ********PARTIE CHART DONUT********
      private construireDonutChart() {
           
           //obtenir garçons, puis filles.
           this.estimationService.obtenirTotalEstimClientParSexe(this.uuidClient,"1")
                    .subscribe(totalGarcons => { 
                      if (totalGarcons != 0) {
                            this.totalEstimGarconsClient = totalGarcons;
                           this.obtenirTotalEstimsClientFilles();
                      } else {this.statsEstimsVide = true}     
                    });
      }   

      private obtenirTotalEstimsClientFilles() {
          //obtenir filles, puis construire la chart.
           this.estimationService.obtenirTotalEstimClientParSexe(this.uuidClient,"2")
                    .subscribe(totalFilles => { this.totalEstimFillesClient = totalFilles;
                           this.remplirChart();     
                    });
      }

     private remplirChart() {
        this.data = {
            labels: ['Filles','Garçons'],
            datasets: [
                {
                    data: [this.totalEstimFillesClient, this.totalEstimGarconsClient],
                    backgroundColor: [
                        "#eb505f",
                        "#1e9ecc"
                    ],
                    hoverBackgroundColor: [
                        "#f1717e",
                        "#4ac2f4"
                    ]
                }]    
            };
    }




}