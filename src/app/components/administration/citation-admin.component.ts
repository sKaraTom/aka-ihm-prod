import { Component, OnInit } from '@angular/core';
import { CitationService } from '../../services/citation.service';
import { NgForm } from '@angular/forms';
import { Citation } from '../../objetmetier/citation';
import { Message, ConfirmationService } from 'primeng/primeng';
import { Router } from '@angular/router';

@Component({
  selector: 'app-citation-admin',
  templateUrl: './citation-admin.component.html',
  styleUrls: ['./citation-admin.component.css','./administration-styles.css']
})
export class CitationAdminComponent implements OnInit {

  private totalCitations : number = 0;
  private listeCitations : Citation[] = [];

  private citationAleatoire : Citation;

  private msgs: Message[] = []; // growl primeng

  constructor(private citationService:CitationService, private router:Router,private confirmationService: ConfirmationService) { }

  ngOnInit() {

      this.obtenirCitations();
      this.obtenirTotalCitations();

  }

  /**
   * ajouter une citation
   * 
   * @param form le formulaire
   */
  public ajouterCitation(form:NgForm) : void {

    let id = Number(form.value.id);
    
    // si un id est saisi, vérifier qu'il est bien un nombre.
    if(isNaN(id)) {
      this.msgs = [],
      this.msgs.push({severity:'warn', summary:'Erreur ID', detail:'l\'id doit être un nombre.'});
    }

    else if(form.valid) {

      let citation:Citation = new Citation();
      citation.id = form.value.id;
      citation.auteur = form.value.auteur;
      citation.contenu = form.value.contenu;

      this.citationService.ajouterCitation(citation)
                          .subscribe(res => {
                            this.msgs = [],
                            this.msgs.push({severity:'info', summary:'Succès', detail:'Citation correctement créée,<br>' + res.id + " <br> " + res.auteur + " <br> " + res.contenu});
                            this.obtenirCitations();
                            this.obtenirTotalCitations();
                            },
                            err => {
                              this.msgs = [],
                              this.msgs.push({severity:'warn', summary:'Echec', detail:err._body});
                            }
                         );
    }
    else {
      this.msgs = [],
      this.msgs.push({severity:'warn', summary:'Champs requis', detail:'les champs auteur et citation sont requis'});
    }

  }

  /**
   * obtenir la liste de toutes les citations
   */
  private obtenirCitations() : void {

    this.citationService.obtenirListeCitations()
      .subscribe(res => this.listeCitations = res,
                err => { if(err.status == 401) {
                            sessionStorage.clear();
                            this.router.navigate(['/admin-connexion']);
                            alert(err._body);
                          }
                        } );
  }

  /**
   * obtenir le nombre total de citations en base
   */
  private obtenirTotalCitations() : void {
    this.citationService.obtenirTotalCitations()
                        .subscribe(res => this.totalCitations = res);
  }

  private obtenirCitationAleatoire() : void {
    this.citationService.obtenirCitationAleatoire()
                        .subscribe(res => this.citationAleatoire = res,
                                    err => {this.msgs = [],
                                            this.msgs.push({severity:'info', summary:'erreur', detail:err._body});});
  }

  private modifierCitation(citation : Citation) : void {

    this.citationService.modifierCitation(citation)
                        .subscribe(res => {
                          this.msgs = [],
                          this.msgs.push({severity:'info', summary:'Succès', detail:res});
                          this.obtenirCitations();
                        },
                        err => { 
                          this.msgs = [],
                          this.msgs.push({severity:'warn', summary:'Echec', detail:err._body});
                        }
                        )
  }

  /**
   * méthode de confirmDialog PrimeNg.
   * si confirmation, appeler la méthode supprimerCitation(citation)
   * 
   * @param Citation 
   */
  private confirmerSuppression(id:number) : void {
    
        this.confirmationService.confirm({
          message: 'Êtes-vous sûr de supprimer cette citation ? L\'opération est irréversible.',
          header: 'Confirmation de suppression',
          icon: 'fa fa-trash',
          accept: () => {
              this.supprimerCitation(id);
          }
        })
      }

  /**
   * supprimer une citation
   * 
   * @param citation 
   */
  private supprimerCitation(id:number) : void {

    this.citationService.supprimerCitation(id)
                        .subscribe(res => {
                          this.msgs = [],
                          this.msgs.push({severity:'info', summary:'Succès', detail:res.toString()});
                          this.listeCitations = this.listeCitations.filter(item => item.id != id);
                          },
                          err =>{this.msgs = [],
                                this.msgs.push({severity:'warn', summary:'Echec', detail:err._body});
                          });

  }
    

}