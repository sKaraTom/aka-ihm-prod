import { Component, OnInit } from '@angular/core';
import { CitationService } from '../../services/citation.service';
import { NgForm } from '@angular/forms';
import { Citation } from '../../objetmetier/citation';

@Component({
  selector: 'app-citation-admin',
  templateUrl: './citation-admin.component.html',
  styleUrls: ['./citation-admin.component.css','./administration-styles.css']
})
export class CitationAdminComponent implements OnInit {

  totalCitations : number = 0;
  listeCitations : Citation[] = [];

  constructor(private citationService:CitationService) { }

  ngOnInit() {

      this.citationService.obtenirListeCitations()
                          .subscribe(res => this.listeCitations = res);

      this.citationService.obtenirTotalCitations()
                          .subscribe(res => this.totalCitations = res);

  }


  public ajouterCitation(form:NgForm) : void {

    console.dir(form.value);
    console.dir(form.valid);

  }


}
