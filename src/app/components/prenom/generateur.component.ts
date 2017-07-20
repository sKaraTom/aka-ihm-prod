
import { Component, OnInit, ViewEncapsulation, trigger, transition, style, animate } from "@angular/core";

import { PrenomService } from "../../services/prenom.service";
import { Client } from "../../objetmetier/client";
import { Estimation } from "../../objetmetier/estimation";
import { EstimationService } from "../../services/estimation.service";
import { AuthentificationService } from "../../services/authentification.service";


//primeNg
import { Message } from "primeng/components/common/api";
//NgBootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



@Component({
  host: {'(window:keydown)': 'activerRaccourciClavier($event)'}, // pour écouter touches clavier et activer raccourcis
  templateUrl :'./generateur.component.html',
  styleUrls: ['./generateur.component.css'],
  animations: [
    trigger('fadeInOut', [
        transition(':enter', [   // :enter est équivalent à 'void => *'
        style({opacity:0}),
        animate(200, style({opacity:1})) 
        ]),
        transition(':leave', [   // :leave est équivalent à '* => void'
        animate(13, style({opacity:0})) 
        ])
    ])
  ],
  providers : [PrenomService, EstimationService],
  //encapsulation: ViewEncapsulation.Native,
})

export class GenerateurComponent implements OnInit {
    

    public uuidClient:string;
    public client:Client;

    public  bouton_sexe:String = '1'; //valeur par défaut du bouton radio
    public nouvelleEstimation:Estimation;


    public afficheStats:Boolean =  false;
    
    //variables pour la Bar chart
    public data: any;
    public options: any;

    public naissances:Number[] = [];
    public annees:String[] = [];

    // choix des tendances.
    public estTendance : boolean;
    public estAncien : boolean;
    public choixTendance:Number;

    //prénom aléatoire
    public nouveauPrenomAleatoire:String;
    private animation:boolean = true; // booleen pour gérer animation fondu in/out entre chaque prénom.
    
    //growl Primeng
    public msgs:Message[]=[];
 
    
    constructor(
    private prenomService: PrenomService,
    private estimationService: EstimationService,
    private authService: AuthentificationService
  ) {
    this.client = new Client();
    this.nouvelleEstimation = new Estimation();

    //initialisation des choix de tendances.
    this.estTendance = false;
    this.estAncien = false;
    this.choixTendance = 1;

    this.nouvelleEstimation.sexe = "1"; 
    this.naissances = [];

    this.authService.idClientObs.subscribe(
        res => {
            if(res) {
                this.uuidClient = res;
            }
            else {
                this.uuidClient = null;
            }
        }
    );

    this.getPrenomAleatoireStats();
  }


 ngOnInit(){
    
    this.remplirXChart();
    
}

private activerRaccourciClavier(event){
        // fleche bas : passer
        if (event.keyCode == 40 && event.ctrlKey){
            this.nePasEstimer();
            let boutonPasser = document.getElementById('btnPasser');
            boutonPasser.classList.add("btnPasserActive");
            setTimeout(() => { boutonPasser.classList.remove("btnPasserActive"); }, 170);
        }
        // fleche gauche : aime pas.
        if (event.keyCode == 37 && event.ctrlKey){
            this.estimerPrenom('false');
            let boutonAimePas = document.getElementById('btnAimePas');
            boutonAimePas.classList.add("btnEstiActive");
            setTimeout(() => { boutonAimePas.classList.remove("btnEstiActive"); }, 170);
        }
        // fleche droite : aime.
        if (event.keyCode == 39 && event.ctrlKey){
            this.estimerPrenom('true');
            let boutonAime = document.getElementById('btnAime');
            boutonAime.classList.add("btnEstiActive");
            setTimeout(() => { boutonAime.classList.remove("btnEstiActive"); }, 170);
        }

             // fleche haut : changer le sexe.
        if (event.keyCode == 38 && event.ctrlKey){
           if(this.bouton_sexe == "1") {
              this.bouton_sexe = "2";
              this.nouvelleEstimation.sexe = "2";
            }
            else {
              this.bouton_sexe = "1";
              this.nouvelleEstimation.sexe = "1";
            }
            this.getPrenomAleatoireStats();
        }

   }



    // méthode subscribe globale.
    public getPrenomAleatoireStats() {
        this.animation = false;
        
        this.prenomService.getPrenomAleatoire(this.nouvelleEstimation.sexe,this.uuidClient, this.choixTendance)
                    .subscribe(res => { 
                                        if(res == "204") {
                                            this.msgs = [],
                                           this.msgs.push({severity:'info', summary:'Bravo',
                                           detail:'il n\'y a plus de prénom à estimer pour cette catégorie.'});
                                        }
                                        else {
                                            this.nouveauPrenomAleatoire = res;
                                            this.nouveauPrenomAleatoire = res; 
                                            this.animation = true;
                                            this.getNaissancesStats();
                                        }
                                         },
                                erreur => { 
                                    this.msgs = [],
                                    this.msgs.push({severity:'warn', summary:'problème serveur ',
                                    detail:erreur._body}); 
                                        }

                                );
    }



public remplirXChart(): void {
    // boucle pour générer x années de la chart.
    for (var i = 1900; i <= 2015; i++) {
            this.annees.push(i.toString());
    }
}

 public getNaissancesStats() {
         this.prenomService.getNaissances(this.nouveauPrenomAleatoire.toUpperCase(), this.nouvelleEstimation.sexe)
                                .subscribe(liste => {(this.naissances) = liste;
                                this.peuplerChart();
                                    });
    }


public peuplerChart() {

    this.data = {
            labels: this.annees,
            datasets: [
                {
                    label: 'Le prénom ' + this.nouveauPrenomAleatoire + ' a été donné ',
                    backgroundColor: '#1e9ecc',
                    hoverBackgroundColor : '#eb505f',	
                    borderColor: '#1E88E5',
                    data: this.naissances
                },
            ]        
    }
    this.options = {
                    responsive: true,
                    title: {
                        display: true,
                        text: this.nouveauPrenomAleatoire + ' né(e)s depuis 1900',
                        fontSize: 16 },
                    legend: {
                        display: false,
                        position: 'bottom', },
                   scales: {
                        xAxes: [{
                                    gridLines: { color: "rgba(0, 0, 0, 0.08)" },
                                    ticks: { autoSkip: true, maxTicksLimit: 12 }    }],
                         yAxes: [{
                                gridLines: { color: "rgba(0, 0, 0, 0.08)" },
                                ticks: { autoSkip: true, maxTicksLimit: 5 }     }]
                    }
     }; 

}


    public choisirSexe(choix:String):String{     
       
        if (this.nouvelleEstimation.sexe == choix || null) {
            return this.nouvelleEstimation.sexe;
        }
        else {
            this.nouvelleEstimation.sexe = choix;
            this.getPrenomAleatoireStats();
            return this.nouvelleEstimation.sexe;
        }
    }


    public estimerPrenom(choix: String) :void {
        // aime ou aime pas.
        this.nouvelleEstimation.akachan = choix;
        
        // condition pour éviter d'estimer 2 fois le même prénom (si clics trop rapides...)
        // en + de l'exception côté mw
        if (this.nouvelleEstimation.prenom != this.nouveauPrenomAleatoire) {
            this.nouvelleEstimation.prenom = this.nouveauPrenomAleatoire;
            
            this.estimationService.estimerPrenom(this.nouvelleEstimation,this.uuidClient)
                                    .subscribe(res => {},
                                    err => {},
                                    () => { this.getPrenomAleatoireStats();  setTimeout(() => {
                                                        this.nouvelleEstimation.prenom = null;}, 5000);}
                                    );
        }
        else {
            this.getPrenomAleatoireStats();
        }
    }

    public nePasEstimer():void {
        // ne pas estimer donc générer un nouveau prénom aléatoire.
        this.getPrenomAleatoireStats();
    }

    public activerPrenomsTendances(e) {
            this.estTendance = e.checked;
            this.estAncien = false;
            this.choixTendance = 2;
            if (!e.checked) {
                this.choixTendance = 1;
            }
            this.getPrenomAleatoireStats();
    }

    public activerPrenomsAnciens(e) {
            this.estAncien = e.checked;
            this.estTendance = false;
            this.choixTendance = 3;
             if (!e.checked) {
                this.choixTendance = 1;
            }
            this.getPrenomAleatoireStats();
    }

 }