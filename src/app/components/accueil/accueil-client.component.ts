
import { Component, OnInit } from "@angular/core";

import { AuthentificationService } from "../../services/authentification.service";
import { EstimationService } from "../../services/estimation.service";
import { ClientService } from "../../services/client.service";
import { Estimation } from "../../objetmetier/estimation";
import { Citation } from "../../objetmetier/citation";
import { CitationService } from "../../services/citation.service";
import { Router } from "@angular/router";




@Component({
  templateUrl : './accueil-client.component.html',
  styleUrls: ['./accueil-client.component.css']
})
export class AccueilClientComponent implements OnInit {


    private uuidClient:string;

    //stats générales
    private totalEstimations:number;
    private totalClients:number;
    private top3Garcons:Array<string>;
    private top3Filles:Array<string>;

    //stats client
    private totalEstimationsClient : number;
    private totalEstimFillesClient :number;
    private totalEstimGarconsClient:number;

    private listeFavoris:Array<Estimation>;

    private prenomClient:string;

    // personnaliser le bonjour/bonsoir en fonction de l'heure de la journée.
    private heure:number;
    private bonjourOuBonsoir:string = "onjour";

    //chart donut
    private data: any;

    // si pas encore de prénoms estimés.
    private statsEstimsVide:boolean = false;

    constructor(
        private estimationService: EstimationService,
        private authService:AuthentificationService,
        private clientService:ClientService,
        private citationService:CitationService,
        private router:Router

  ) {
    this.top3Garcons = new Array<string>();
    this.top3Filles = new Array<string>();

    this.ecrireMessageBonjour();
  
    this.authService.idClientObs.subscribe(
        res => {
          if(res) {this.uuidClient = res; }
          else    { this.uuidClient = null; }
        })

     this.construireDonutChart();
     this.obtenirListeFavoris();
    
  }
       
    ngOnInit(): void {

        this.authService.prenomClientObs.subscribe(
        res => { 
                if(res) { this.prenomClient = res; }
                else    { this.prenomClient = null; }
        })

        this.obtenirNbreEstimsClient();
        
        this.obtenirTop3GarconsFilles();
        this.obtenirTotalEstimations();
        this.obtenirTotalClients();

    }

      /**
       * afficher "bonjour" ou "bonsoir" selon l'heure de la journée.
       */
      private ecrireMessageBonjour() : void {

        let today = new Date();
        this.heure = today.getHours();
        
        if((this.heure > 19) || (this.heure < 4)) {
            this.bonjourOuBonsoir = "onsoir";
        }
        else {
          this.bonjourOuBonsoir = "onjour";
        }
      }

      
      /**
       * obtenir la liste de favoris d'un client.
       */
      private obtenirListeFavoris() : void {
           
           this.estimationService.obtenirListeFavoris(this.uuidClient)
                                .subscribe(liste => this.listeFavoris = liste,
                                err => {
                                  if(err.status == 401) {
                                    localStorage.clear();
                                    this.router.navigate(['/login']);
                                    alert(err._body);
                                  }
                                },
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

      /**
       * obtenir le nombre total d'estimations d'un client.
       */
      private obtenirNbreEstimsClient() : void {
           this.estimationService.obtenirTotalEstimClient(this.uuidClient).subscribe(
                  res => this.totalEstimationsClient = res
            );
            if (this.totalEstimationsClient == null) {
              this.totalEstimationsClient = 0;
            }
      }

      // ********PARTIE STATS GENERALES********
      
      /**
       * obtenir le top 3 des prénoms aimés pour les 2 sexes.
       */
      private obtenirTop3GarconsFilles() : void {
            this.estimationService.obtenirTop3Estimations("1")
                                .subscribe(res => this.top3Garcons = res );
            this.estimationService.obtenirTop3Estimations("2")
                                .subscribe(res => this.top3Filles = res );

      }

      /**
       * obtenir le nombre total de clients.
       */
      private obtenirTotalClients() : void {
         this.clientService.obtenirTotalClients()
                          .subscribe(res => this.totalClients=res);
      }

      /**
       * obtenir le nombre total d'estimations tous clients confondus.
       */
      private obtenirTotalEstimations() : void {
        this.estimationService.obtenirTotalEstimations()
                    .subscribe ( res => this.totalEstimations = res)
        }



      // ********PARTIE CHART DONUT********
      
      /**
       * méthode de départ : 
       * 1.obtenir le nombre total d'estimations de garçons du client.
       * 
       */
      private construireDonutChart() : void {
           
           this.estimationService.obtenirTotalEstimClientParSexe(this.uuidClient,"1")
                    .subscribe(totalGarcons => { 
                      if (totalGarcons != 0) {
                            this.totalEstimGarconsClient = totalGarcons;
                            this.obtenirTotalEstimsClientFilles();
                      } else {this.statsEstimsVide = true}     
                    });
      }   

      /**
       * 2.obtenir total estimations filles du client.
       */
      private obtenirTotalEstimsClientFilles() : void {
          //obtenir filles, puis construire la chart.
           this.estimationService.obtenirTotalEstimClientParSexe(this.uuidClient,"2")
                    .subscribe(totalFilles => { 
                          this.totalEstimFillesClient = totalFilles;
                          this.remplirChart();     
                    });
      }
    
    /**
     * 3.peupler la charte Donut des nombres obtenus.
     */
     private remplirChart() : void {
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