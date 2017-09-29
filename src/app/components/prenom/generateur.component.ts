
import { Component, OnInit, ViewEncapsulation, trigger, transition, style, animate } from "@angular/core";

import { PrenomService } from "../../services/prenom.service";
import { Client } from "../../objetmetier/client";
import { Estimation } from "../../objetmetier/estimation";
import { EstimationService } from "../../services/estimation.service";
import { AuthentificationService } from "../../services/authentification.service";


//primeNg
import { Message } from "primeng/components/common/api";
import { PrenomInsee } from "../../objetmetier/prenominsee";
import { Router } from "@angular/router";



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
  ]
})

export class GenerateurComponent implements OnInit {
    

    private uuidClient:string;

    private  choixSexe:string = '1'; //valeur par défaut du bouton radio
    private nouvelleEstimation:Estimation;

    private typo : string = "typoAka";

    // choix des tendances.
    private estTendance : boolean;
    private estAncien : boolean;
    private choixTendance:Number;

    //prénom aléatoire
    private prenomAleatoire:string;
    private animation:boolean = true; // booleen pour gérer animation fondu in/out entre chaque prénom.
    
    //variables pour la Bar chart
    private data: any;
    private options: any;

    private naissances:Number[] = [];
    private annees:string[] = [];
    
    // stats complémentaires
    private totalNaissances : number = 0;
    private maxNaissances : PrenomInsee[] = [];

    //growl Primeng
    private msgs:Message[]=[];
 
    
    constructor(
    private prenomService: PrenomService,
    private estimationService: EstimationService,
    private authService: AuthentificationService,
    private router:Router
    ) {
    
    this.nouvelleEstimation = new Estimation();

    //initialisation des choix de tendances.
    this.estTendance = false;
    this.estAncien = false;
    this.choixTendance = 1;

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

/**
 * méthode de paramétrage des raccourcis claviers.
 * 
 * @param event 
 */
private activerRaccourciClavier(event) : void {
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
           if(this.choixSexe == "1") {
              this.choixSexe = "2";
            }
            else {
              this.choixSexe = "1";
            }
            this.getPrenomAleatoireStats();
        }

   }

    /**
     * obtenir un prénom aléatoire puis activer 
     * la méthode d'obtention des stats de naissances associées.
     */
    private getPrenomAleatoireStats() : void {
        this.animation = false;
        
        this.prenomService.getPrenomAleatoire(this.choixSexe,this.uuidClient, this.choixTendance)
                    .subscribe(res => { 
                                        if(res == "204") {
                                            this.msgs = [],
                                            this.msgs.push({severity:'info', summary:'Bravo !',
                                            detail:'il n\'y a plus de prénom à estimer pour cette catégorie.'});
                                        }
                                        else {
                                            this.prenomAleatoire = res;
                                            this.animation = true;
                                            this.getNaissancesStats(res);
                                        }
                                         },
                                erreur => { 
                                    if(erreur.status == 401) { // si la validation du token est un échec
                                        localStorage.clear();
                                        this.router.navigate(['/login']);
                                        alert(erreur._body);
                                      }
                                    else {
                                        this.msgs = [],
                                        this.msgs.push({severity:'warn', summary:'problème serveur ',
                                        detail:erreur._body}); 
                                    }
                                    });
    }


/**
 * générer le tableau de référence abscisse de la chart.
 */
private remplirXChart(): void {
    // boucle pour générer x années de la chart.
    for (var i = 1900; i <= 2015; i++) {
            this.annees.push(i.toString());
    }
}

/**
 * obtenir le nombre de naissances pour un prénom.
 */
private getNaissancesStats(prenom:string) : void {
         
    this.prenomService.getNaissances(prenom.toUpperCase(), this.choixSexe)
                        .subscribe(res => { this.naissances = res;
                                            this.peuplerStats(prenom);
                                    },
                                err => { this.msgs = [],
                                    this.msgs.push({severity:'warn', summary:'problème serveur ',
                                    detail:'une erreur interne est survenue.'}); });
}

/**
 * obtenir les données pour les stats (chart et chiffres statistiques)
 */
private peuplerStats(prenom:string) {

    this.construireChart();
    this.obtenirTotalNaissancesPourUnPrenom(prenom,this.choixSexe);
    this.obtenirMaxNaissancesPourUnPrenom(prenom,this.choixSexe);
}

/**
 * construire la chart
 */
private construireChart() : void {
    this.data = {
        labels: this.annees,
        datasets: [
            {
                label: 'Le prénom ' + this.prenomAleatoire + ' a été donné ',
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
                    text: this.prenomAleatoire + ' né(e)s depuis 1900',
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

/**
 * au changement de sexe via le bouton radio,
 * relancer l'obtention d'un prénom aléatoire.
 * 
 * @param choix 
 */
private changerSexe() : void {

    this.getPrenomAleatoireStats();
}

/**
 * estimer un prénom puis obtenir un nouveau prénom aléatoire.
 * 
 * @param choix 
 */
private estimerPrenom(choixAkachan: string) : void {
        // aime ou aime pas.
        this.nouvelleEstimation.akachan = choixAkachan;
        this.nouvelleEstimation.sexe = this.choixSexe;
        
        // condition pour éviter d'estimer 2 fois le même prénom (si clics trop rapides...)
        // en + de l'exception côté mw
        if (this.nouvelleEstimation.prenom != this.prenomAleatoire) {
            this.nouvelleEstimation.prenom = this.prenomAleatoire;
            
            this.estimationService.estimerPrenom(this.nouvelleEstimation,this.uuidClient)
                                    .subscribe(res => {},
                                    err => {},
                                    () => {     this.getPrenomAleatoireStats();  setTimeout(() => {
                                                this.nouvelleEstimation.prenom = null;}, 5000);}
                                    );
        }
        else {
            this.getPrenomAleatoireStats();
        }
}

/**
 * méthode attribuée au bouton "passer" : 
 * obtenir un nouveau prénom aléatoire uniquement.
 */
private nePasEstimer() : void {
        this.getPrenomAleatoireStats();
    }

/**
 * bouton "prénom tendance" : booleen estTendance true,
 * définir la variable choixTendance
 * et générer un prénom aléatoire.
 * 
 * @param e 
 */    
private activerPrenomsTendances(e) : void {
            this.estTendance = e.checked;
            this.estAncien = false;
            this.choixTendance = 2;
            if (!e.checked) {
                this.choixTendance = 1;
            }
            this.getPrenomAleatoireStats();
    }

/**
 * bouton "prénom ancien" : booleen estAncien
 * définir la variable choixTendance
 * et générer un prénom aléatoire.
 * 
 * @param e 
 */    
private activerPrenomsAnciens(e) {
            this.estAncien = e.checked;
            this.estTendance = false;
            this.choixTendance = 3;
             if (!e.checked) {
                this.choixTendance = 1;
            }
            this.getPrenomAleatoireStats();
}

/**
 * obtenir les années où il y a eu le + de naissances pour un prénom donné.
 * @return PrenomInsee[] maxNaissances
 */
private obtenirTotalNaissancesPourUnPrenom(prenom:string, sexe:string) : void {
    
          this.prenomService.obtenirTotalNaissancesPourUnPrenom(prenom.toUpperCase(), sexe)
                            .subscribe(res =>this.totalNaissances = res);
}


/**
 * obtenir les années où il y a eu le + de naissances pour un prénom donné.
 * @return PrenomInsee[] maxNaissances
 */
private obtenirMaxNaissancesPourUnPrenom(prenom:string, sexe:string) : void {
    
          this.prenomService.obtenirAnneesMaxNaissancesPourUnPrenom(prenom.toUpperCase(), sexe)
                            .subscribe(res =>this.maxNaissances = res);
}


 }