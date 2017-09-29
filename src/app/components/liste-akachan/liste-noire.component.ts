
import { Component, OnInit } from "@angular/core";

import { AuthentificationService } from "../../services/authentification.service";
import { Estimation } from "../../objetmetier/estimation";
import { SelectItem, MenuItem, Message } from "primeng/primeng";
import { EstimationService } from "../../services/estimation.service";
import { Router } from "@angular/router";




@Component({
    selector:'liste-noire',
    templateUrl : './liste-noire.component.html',
    styleUrls: ['./liste-styles.css']
})
export class ListeNoireComponent implements OnInit {
    
    public listeNoire: Array<Estimation>;
    public uuidClient: string;

    listeGenre: SelectItem[];

    estimARepecher:Estimation;


    loading: boolean; // icône chargement datatable
    items: MenuItem[]; // context menu de la datatable.
    msgs: Message[] = [];


    constructor( 
        private authService : AuthentificationService,
        private estimationService : EstimationService,
        private router:Router) {


        this.authService.idClientObs.subscribe(
            res => {
            if(res) {
                this.uuidClient = res;
            }
            else {
                this.uuidClient = null;
            }
        })

        }
        
    ngOnInit(): void {

        this.loading = true;
        this.obtenirListeNoire();

        // filtre par sexe dans datatable.
        this.listeGenre = [];
        this.listeGenre.push({label: 'tous', value: null});
        this.listeGenre.push({label: 'garçon', value: '1'});
        this.listeGenre.push({label: 'fille', value: '2'});

        // context menu
        this.items = [
            {label: 'j\'aime ce prénom', icon: 'fa-star-half', 
            command: (event) => this.repecherPrenom(this.estimARepecher),
             }
        ]; 

    }

    /**
     * obtenir la liste noire d'un client.
     */
    public obtenirListeNoire() : void {
         this.estimationService.obtenirListeNoire(this.uuidClient)
                                .subscribe(liste => this.listeNoire = liste,
                                erreur => {
                                    if(erreur.status == 401) {
                                        localStorage.clear();
                                        this.router.navigate(['/login']);
                                        alert(erreur._body);
                                      }
                                },
                                () => this.loading = false
                                );
    }

    /**
     * modifier une estimation pour la passer dans la liste Akachan
     * et filtrer la listeNoire pour supprimer l'estimation côté ihm.
     * 
     * @param estimation l'estimation à modifier.
     */
    public repecherPrenom(estimation:Estimation) {

            estimation.dateEstimation = new Date();
            estimation.akachan = "true";

           this.estimationService.modifierEstimation(estimation)
                 .subscribe(
                    data => {
                          // retirer l'estimation de la liste noire déjà chargée.
                          this.listeNoire = this.listeNoire.filter(item => item != this.estimARepecher )
                   }
                    ); 
            this.msgs = [],
            this.msgs.push({severity:'info', summary:'Confirmation', detail:'Prénom ajouté à votre liste Akachan'})
    }

}