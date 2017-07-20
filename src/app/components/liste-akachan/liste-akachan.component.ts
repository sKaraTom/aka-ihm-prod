import { OnInit, Component } from "@angular/core";
import { Router } from '@angular/router';

//primeng
import { OverlayPanel } from "primeng/primeng";
import { ConfirmationService, Message, MenuItem, SelectItem } from 'primeng/primeng';


import { ClientService } from "../../services/client.service";
import { PrenomService } from "../../services/prenom.service";
import { EstimationService } from "../../services/estimation.service";
import { Client } from "../../objetmetier/client";
import { Estimation } from "../../objetmetier/estimation";
import { AuthentificationService } from "../../services/authentification.service";
import { EmailService } from "../../services/email.service";



@Component({
    selector:'liste-akachan',
    templateUrl : './liste-akachan.component.html',
    styleUrls: ['./liste-styles.css','./liste-akachan.component.css'],
    providers : [ConfirmationService]
    
})
export class ListeAkachanComponent implements OnInit {
        
        private client:Client;
        private listeAkachan: Array<Estimation>;
        private estimSelectionnees: Estimation[];
        private uuidClient:String;

        // partie dialog envoi mail
        private dialogMailEstVisible:boolean;
        private mailClientCheck:boolean; // checkbox mail client
        private mailAutreCheck:boolean; // checkbox mail autre à préciser.
        private mailClient:string;
        private mailAutre:string;
        private listePrenomsAEnvoyer:Estimation[]; // sélection des prénoms à envoyer par mail.
        private messageErreur:string;

        listeGenre: SelectItem[]; // filtre par sexe dans la datatable.

        loading: boolean; // icône chargement datatable.
        msgs: Message[] = []; // growl primeng
        items: MenuItem[]; // context menu de la datatable.

        //partie stats
        private estimationSelectionnee:Estimation;
        private naissances:Number[] = [];
        private data: any;
        private options: any;
        private annees:String[] = [];



    constructor(
        private router: Router,
        private clientService: ClientService,
        private prenomService: PrenomService,
        private confirmationService: ConfirmationService,
        private estimationService: EstimationService,
        private authService:AuthentificationService,
        private emailService:EmailService
    ) {
    
        this.estimationSelectionnee = new Estimation();
        this.estimSelectionnees = [];

        this.dialogMailEstVisible = false;
        this.mailClientCheck = true;
        this.mailAutreCheck = false;
        this.listePrenomsAEnvoyer = [];
    
        this.authService.idClientObs.subscribe(
            res => {
            if(res) { this.uuidClient = res;}
            else {  this.uuidClient = null; }
            })
        
    }
       
    ngOnInit(): void {
        
        this.obtenirListeAkachan();
        this.loading = true;
        this.peuplerFiltreGenre();
        this.obtenirClient();
       
        
        this.remplirXChart();

        this.items = [
            {label: 'Je n\'aime plus', icon: 'fa-thumbs-down', 
            command: (event) => this.confirmerSuppression(),
             }
        ]; 
       

    }
    
    /** à partir d'une estimation sélectionnée ouvrir l'overlay contenant les stats du prénom (chart).
     * @param event pour afficher l'overlay de stats (chart)
     * @param estimation // permet de récupérer l'estimation depuis la datatable et l'attribuer à une variable
     * qui servira à l'affichage de la chart (et prénom dans son titre)
     * @param overlaypanel  l'overlay à ouvrir.
     */
    private selectEstim(event,estimation: Estimation, overlaypanel: OverlayPanel):void {
            
            this.estimationSelectionnee = estimation; 
            this.data = null; // remettre à null si une chart avait déjà été affichée.
            this.getNaissancesStats(); // activer la création de la chart.
            overlaypanel.toggle(event); // afficher le pop-up overlay
    }

    /** obtenir la liste akachan (prénoms aimés)
     *  pour afficher dans la datatable.
     */
    private obtenirListeAkachan() : void {
         
         if(!this.listeAkachan) {
         this.clientService.obtenirListeAkachan(this.uuidClient)
                                .subscribe(
                                    liste => this.listeAkachan = liste,
                                    erreur => {},
                                    () => this.loading = false
                                );
        }
    }

    /** dropdown choix du filtre par genre dans la datatable.
     * tous, garçons ou filles.
     */    
    private peuplerFiltreGenre() : void {
        
        this.listeGenre = [];
        this.listeGenre.push({label: 'tous', value: null});
        this.listeGenre.push({label: 'garçon', value: '1'});
        this.listeGenre.push({label: 'fille', value: '2'});
    }

    /** obtenir mail du client pour l'envoi de prénoms par mail.
     * 
     */
    private obtenirClient() : void {
      
      this.clientService.obtenirClient(localStorage.getItem("id"))
                        .subscribe(res => this.mailClient=res.compte.email
                        );
    }

    /** ouvrir la fenêtre dialog pour envoi de mail
     * vérifier que des estim ont bien été sélectionnées.
     * copier ces estim dans une liste indépendante pour l'envoi.
     */
    private ouvrirDialogMail():void {

        if( this.estimSelectionnees.length != 0  ) {
            this.dialogMailEstVisible = true;

            // copier les estim sélectionnées dans une nouvelle liste pour garder la sélection sur la datatable
            // même si annulation de l'envoi de mail.
            this.listePrenomsAEnvoyer = Object.assign([], this.estimSelectionnees);
        }
        else {
            this.msgs = [],
            this.msgs.push({severity:'warn', summary:'Aucun prénom sélectionné', detail:''});
        }
    }

    /** envoyer au mw une sélection  de prénoms, le prénom du client,
     * le mail du client ou "nonVoulu", un autre mail saisi ou "nonVoulu" (si checkbox non cochées).
     */
    private envoyerMail() : void {
        
        let prenomClientAEnvoyer = localStorage.getItem('prenom');
        let mailClientAEnvoyer:string;
        let mailAutreAEnvoyer:string;

        if( this.validerEnvoi() ) {
            
            this.mailClientCheck ? mailClientAEnvoyer = this.mailClient : mailClientAEnvoyer = "nonVoulu";
            this.mailAutreCheck ? mailAutreAEnvoyer = this.mailAutre.trim() : mailAutreAEnvoyer = "nonVoulu";
                
            this.emailService.envoyerMailSelectionPrenoms(this.listePrenomsAEnvoyer,prenomClientAEnvoyer,mailClientAEnvoyer,mailAutreAEnvoyer)
                    .subscribe(res => {this.confirmerEnvoiMail()},
                    err => { this.messageErreur = err._body;
                            setTimeout(() => { this.messageErreur = null; }, 4000);}
                    );
        }
    }

    /** si succès de l'envoi, fenêtre dialog se ferme et affichage d'un growl de succès.
     * 
     */
    private confirmerEnvoiMail():void {
        
        this.dialogMailEstVisible = false;
        this.msgs = [],
        this.msgs.push({severity:'info', summary:'Email envoyé', detail:'votre sélection a bien été envoyée.'});

    }

    /** méthode de validation globale chargée d'afficher les messages d'erreur.
     * 
     */
    private validerEnvoi() : boolean {
        
        // si aucune checkbox n'est cochée.
        if( !this.validerCheckMinimumUnMail() ) {
            this.messageErreur = "aucun mail sélectionné."
            setTimeout(() => { this.messageErreur = null; }, 4000);
            return false;
        }
        // si le mail client n'est pas sélectionné et le mail autre n'est pas valide.
        else if(this.mailAutreCheck && !this.validerEmail(this.mailAutre)) {
            this.messageErreur = "le mail saisi n'est pas valide."
            setTimeout(() => { this.messageErreur = null; }, 4000);
            return false;
        }
        else {
            return true;
        }
    }

    /** vérifier qu'au moins un mail est sélectionné (checkbox)
     * 
     */
    private validerCheckMinimumUnMail() : boolean {
        if(this.mailClientCheck || this.mailAutreCheck) {
            return true;
        }
        else {
            return false;
        }
    }

    /** vérifier que l'email n'est pas null et ne contient pas d'espace.
     * validation simple, le mw se charge du reste.
     * 
     * @param email email autre saisi par client
     */
    private validerEmail(email:string) : boolean {
          
        if (email == null || email == "") {
            return false;
        }

        else if ( this.contenirEspaces(email)) {
            return false;
        }
        else {
            return true;
        }

    }

    /** regex qui vérifie si le mail contient des espaces entre caractères.
     * 
     * @param mot 
     */
    private contenirEspaces(mail:string):boolean {
             return /\s/g.test(mail);
    }


    /** Annuler l'envoi de mail : fermeture de la fenêtre dialog. 
     * vider la liste de prénoms sélectionnés
     * fermer la fenêtre avec booleen dialogMailEstVisible=false.
     */
    private annulerDialogMail():void {
       
        this.listePrenomsAEnvoyer.length =0;
        this.dialogMailEstVisible=false;
    }

    /** dialog de confirmation avant retrait estimations de la liste
     * vérifier d'abord si des estimations ont été sélectionnées.
     */
   private confirmerSuppression() {

        if(this.estimSelectionnees.length !=0) {
                this.confirmationService.confirm({
                message: 'Retirer de votre liste Akachan ?',
                header: 'Je n\'aime plus',
                icon: 'fa fa-thumbs-down',
                accept: () => {
                    this.passerEstimDansListeNoire(this.estimSelectionnees);
                }
            })
        }
        else {
            this.msgs = [],
                this.msgs.push({severity:'warn', summary:'Aucun prénom sélectionné', detail:''});
        }
            
    }

    /** si fenêtre confirmation : OK active cette méthode.
     * retrait des estim dans la liste côté ihm et mw.
     * @param estimations la sélection d'estim sélectionnées
     */
    public passerEstimDansListeNoire( estimations: Estimation[]) {
            
                this.estimationService.changerDeListeEstimations(this.estimSelectionnees, "false")
                 .subscribe(
                    data => {
                        // retirer les estimations de la liste akachan
                        for (let estim of estimations) {
                                 this.listeAkachan = this.listeAkachan.filter(item => item != estim )  
                        }
                   }
                    ); 
            this.msgs = [],
            this.msgs.push({severity:'info', summary:'Confirmation', detail:'Prénom(s) retiré(s) de votre liste Akachan'});
            this.estimSelectionnees = [];
    
    }


/** modifier estim pour ajouter ou enlever marqueur favori.
 * 
 */
 public modifierEstimation(estimation:Estimation) {
        
        // opérateur ternaire : condition ? true:false;
        estimation.favori ? estimation.favori = false : estimation.favori = true;
        
        this.estimationService.modifierEstimation(estimation)
                .subscribe(
                    data => {},
                    )  
        
 }



///////////// Partie stats /////////////

/** méthode globale.
 *  1.récupérer  les nombres de naissances de l'estimation sélectionnée
 * 2. construire avec ses paramètres le graphique.
 */ 
 public getNaissancesStats() {
         this.prenomService.getNaissances(this.estimationSelectionnee.prenom.toUpperCase(), this.estimationSelectionnee.sexe)
                                .subscribe(liste => {(this.naissances) = liste;
                                this.construireGraphique();
                                    });
  }

/** Boucle pour générer abscisse(x) : années de la chart.
 * 
 */ 
public remplirXChart(): void {
    
    for (var i = 1900; i <= 2015; i++) {
            this.annees.push(i.toString());
    }
}

public construireGraphique() {

    this.data = {
            labels: this.annees,
            datasets: [
                {
                    label: 'Le prénom ' + this.estimationSelectionnee.prenom + ' a été donné ',
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



}
  