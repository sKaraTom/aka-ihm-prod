
import { Component, OnInit } from "@angular/core";
import { PrenomService } from "../../services/prenom.service";
import { OverlayPanel, Message } from "primeng/primeng";
import { Estimation } from "../../objetmetier/estimation";
import { EstimationService } from "../../services/estimation.service";
import { AuthentificationService } from "../../services/authentification.service";
import { Observable } from "rxjs/Rx";
import { Recherche } from "../../objetmetier/recherche";
import { PrenomInsee } from "../../objetmetier/prenominsee";



@Component({
  templateUrl : './recherche.component.html',
  styleUrls: ['./recherche.component.css'],
})
export class RechercheComponent implements OnInit {

        private uuidClient:string;

        private saisieRecherche:string;

        // options recherche
        private choixSexe:string = '1'; //bouton radio : valeur par défaut sur garçon.
        private choixSexeRecherche:string = '1';
        private estRechercheExacte:boolean = false; // checkbox
        
        private resultatsMap : Map<string,boolean>; // map récupérée du mw, à convertir en array pour datalist.
        private resultatsAAfficher:Recherche[]; // array pour datalist.

        private messageEchec:string;

        //partie stats
        private prenomSelectionne:string; // pour récupérer le prénom pop-up stats.
        private naissances:Number[] = [];
        private data: any;
        private options: any;
        private annees:string[] = [];

        // stats complémentaires
        private totalNaissances : number = 0;
        private maxNaissances : PrenomInsee[] = [];

         msgs: Message[] = []; // growl primeng


       constructor(
                private prenomService:PrenomService,
                private estimationService:EstimationService,
                private authService:AuthentificationService
                ) 
                {
                    this.resultatsMap = new Map();
                    this.resultatsAAfficher = [];

                    this.authService.idClientObs.subscribe(
                         res => {   if(res) { this.uuidClient = res;}
                                    else {this.uuidClient = null;}
                        }
                    );

                }
       
       
    ngOnInit(): void {
          
        this.remplirXChart();

    }
      

    /**
     * chercher un prénom saisi par l'utilisateur
     * 
     * @param event 
     */
    public chercherPrenom(event:Event) : void {
        event.preventDefault();
        
        // vider les listes si précédentes recherches. 
       this.resultatsAAfficher.length = 0;
       this.resultatsMap = null;

       if(this.validerSaisie(this.saisieRecherche)) {
        
            // repasser à 0 le message d'échec avant d'effectuer une nouvelle recherche.
            this.messageEchec = null;

            //supprimer les blancs superflus (envoi mw et dans input html)
            this.saisieRecherche = this.saisieRecherche.trim();
            
            // transférer la valeur du bouton radio (choixSexe) dans une autre variable : choixSexeRecherche
            // pour garder le sexe sélectionné lors de la recherche même si on modifie le bouton radio après.
            this.choixSexeRecherche = this.choixSexe;

            // créer une estimation à envoyer au mw.
            let estimationAVerifier = new Estimation();
            estimationAVerifier.prenom = this.saisieRecherche;
            estimationAVerifier.sexe = this.choixSexe;
            estimationAVerifier.refClient = this.uuidClient;

            this.prenomService.rechercherPrenomEtEstimExistante(estimationAVerifier,this.estRechercheExacte)
                                .subscribe(
                                    res => {
                                        if(res == 204) {
                                        this.messageEchec = "aucun prénom trouvé pour cette saisie.";
                                        }
                                        else {
                                            this.resultatsMap = res;
                                            // convertir les clé/valeur de la map en array : Recherche[] pour datalist.
                                            for(let key in this.resultatsMap ) {
                                                let recherche:Recherche = new Recherche();
                                                recherche.prenom = key;
                                                recherche.estEstime = this.resultatsMap[key];
                                                this.resultatsAAfficher.push(recherche);
                                            }
                                        }
                                    },
                                    err => this.messageEchec = "une erreur est survenue."
                                );

        }
        event.stopPropagation();
      }

    /**
     * estimer un prénom positivement (bouton "j'aime")
     * 
     * @param event 
     * @param prenom 
     */
    public estimerPrenom(event:Event,prenom:string) : void {
            event.preventDefault();
            
            let estimation:Estimation = new Estimation();
            estimation.prenom = prenom;
            estimation.sexe = this.choixSexe;
            estimation.akachan = "true";
            this.estimationService.estimerPrenom(estimation,this.uuidClient)
                                    .subscribe(res => {},
                                    err => {
                                        //conflict : l'estimation existe déjà.
                                        if(err.status == 409) {
                                           this.msgs = [],
                                           this.msgs.push({severity:'warn', summary:'Prénom ' + prenom + ' déjà estimé',
                                           detail:'Retrouvez-le dans votre rubrique "Ma liste".'}); 
                                        }
                                      // en cas d'erreur autre.
                                      else {
                                            this.msgs = [],
                                            this.msgs.push({severity:'warn', summary:'erreur',
                                            detail:'Une erreur est survenue à l\'enregistrement de ce prénom.'});
                                      }
                                    },
                                    () => { this.msgs = [],
                                            this.msgs.push({severity:'info', summary:'Succès !',
                                            detail:'Le prénom ' + prenom + ' est ajouté à votre liste Akachan.'});}
                                    );
            event.stopPropagation();
        }

    /**
     * valider que la saisie est conforme
     * 
     * @param saisie
     * @return booleen true si valide.
     */
    private validerSaisie (saisie:string) : boolean {
          
           // si la saisie est vide ou ne contient que des espaces.
        if(!saisie || !saisie.trim()) {
            this.messageEchec = "vous devez saisir un prénom pour effectuer une recherche.";
            return false;
        }

        // ou si la saisie a moins de 2 caractères.
        else if(saisie.trim().length < 2) {
            // trimer la saisie pour reformater le champ input sans espaces superflus.
            this.saisieRecherche = this.saisieRecherche.trim();
            this.messageEchec = "saisissez au minimum deux caractères pour effectuer une recherche.";
            return false;
        }  
        else {
            return true;
        }

    }


/////////// PARTIE STATS BAR CHART


    /**
     * afficher les stats :
     * récupèrer le prénom de la datalist et le stocke dans la variable prenomSelectionne.
     * remplir la chart, et ouvrir le pop-up overlay dédié.
     */ 
    public afficherStats(event:Event,prenom:string,overlaypanel: OverlayPanel):void {
        this.prenomSelectionne = prenom;

        this.data = null; // remettre à null si une chart avait déjà été affichée.
        this.getNaissancesStats();
        this.obtenirTotalNaissancesPourUnPrenom(prenom.toUpperCase(),this.choixSexeRecherche);
        this.obtenirMaxNaissancesPourUnPrenom(prenom.toUpperCase(),this.choixSexeRecherche);
        overlaypanel.toggle(event); // afficher le pop-up overlay
    }


    /**
     * obtenir les nombres de naissances pour un prénom.
     * puis activer la méthode de construction de la chart.
     */
    public getNaissancesStats() {
            this.prenomService.getNaissances(this.prenomSelectionne.toUpperCase(), this.choixSexeRecherche)
                                    .subscribe(liste => {(this.naissances) = liste;
                                    this.getStats();
                                        });
    }

    /**
     * peupler un tableau des années (abscisse de la chart)
     */
    public remplirXChart(): void {
        // boucle pour générer axe x années de la chart.
        for (var i = 1900; i <= 2015; i++) {
                this.annees.push(i.toString());
        }
    }
    
    /**
     * construire la chart
     */
    public getStats() {
        // remplir la chart avec le binding année/nombres naissances.
        this.data = {
                labels: this.annees,
                datasets: [
                    {
                        label: 'Le prénom ' + this.prenomSelectionne + ' a été donné ',
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
