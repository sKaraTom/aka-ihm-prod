import { OnInit, Component } from "@angular/core";
import { Citation } from "../../objetmetier/citation";
import { CitationService } from "../../services/citation.service";

@Component({
    selector:'citation',
     templateUrl : './citation.component.html',
    styleUrls: ['./citation.component.css'],
})
export class CitationComponent implements OnInit {
    
    private citationAleatoire:Citation;
    private citationChargee:boolean = false;
        

constructor( private citationService:CitationService ) {
        this.citationAleatoire = new Citation();
}



ngOnInit(): void {
    
    this.obtenirCitationAleatoire();

}

    /**
     * obtenir une citation aléatoire.
     */
    private obtenirCitationAleatoire() : void {

        this.citationService.obtenirCitationAleatoire()
                            .subscribe(res => {this.citationAleatoire = res; this.citationChargee = true; });
    }



}
