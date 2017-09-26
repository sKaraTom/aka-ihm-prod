import { Component, OnInit } from '@angular/core';
import { CitationService } from '../../services/citation.service';

@Component({
  selector: 'app-citation-admin',
  templateUrl: './citation-admin.component.html',
  styleUrls: ['./citation-admin.component.css','./administration-styles.css']
})
export class CitationAdminComponent implements OnInit {

  constructor(private citationService:CitationService) { }

  ngOnInit() {

      this.citationService.obtenirListeCitations()
                          .subscribe(res => console.dir(res));
      this.citationService.obtenirTotalCitations()
                          .subscribe(res => console.log("total", res));

  }

}
