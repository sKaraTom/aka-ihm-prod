

import { OnInit, Component } from "@angular/core";
import { Router } from "@angular/router";
import { Http } from "@angular/http";
import { EstimationService } from "../../services/estimation.service";
import { ClientService } from "../../services/client.service";


@Component({
    selector:'accueil',
     templateUrl : './accueil.component.html',
    styleUrls: ['./accueil.component.css'],
    providers : [EstimationService]
})
export class AccueilComponent implements OnInit {
       
      images: any[];

       totalEstimations:number;
       totalClients:number;
       top3Garcons:Array<String>;
       top3Filles:Array<String>;
       

    constructor(
        private router: Router,
        private http: Http,
        private estimationService: EstimationService,
        private clientService: ClientService
        ) { 
            this.top3Garcons = new Array<String>();
            this.top3Filles = new Array<String>();
        }


    ngOnInit(): void {
        this.obtenirTotalClients();
        this.obtenirTotalEstimations();
        this.obtenirTop3GarconsFilles();
        
        this.peuplerCarrousel();
       
    }

        private obtenirTotalClients() :void {
            this.clientService.obtenirTotalClients().subscribe(res => this.totalClients=res);
        }


        private obtenirTotalEstimations() : void {
            this.estimationService.obtenirTotalEstimations()
                    .subscribe ( res => this.totalEstimations = res)

        }

        
         private obtenirTop3GarconsFilles():void{
            this.estimationService.obtenirTop3Estimations("1")
                                .subscribe(res => this.top3Garcons = res );
            this.estimationService.obtenirTop3Estimations("2")
                                .subscribe(res => this.top3Filles = res );
      }

        private peuplerCarrousel() {
            this.images = [];
            this.images.push({source:'assets/img/carousel1.gif', alt:'Des prénoms vous sont proposés sous forme de jeu, c\'est vous qui voyez.', title:'La fabrique de prénoms'});
            this.images.push({source:'assets/img/carousel2.gif', alt:'Consultez la popularité du prénom pour vous aider à la réflexion.', title:'De l\'aide au choix'});
            this.images.push({source:'assets/img/carousel3.gif', alt:'Retrouvez vos coups de coeur dans votre liste  et + encore !', title:'Votre liste Akachan'});
        }

    
        private accederInscription():void {
            this.router.navigate(['/login/inscription']);
        }



}