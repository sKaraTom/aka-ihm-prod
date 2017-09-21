import { Component, OnInit } from '@angular/core';
import { CompteService } from "../../services/compte.service";
import { Compte } from "../../objetmetier/compte";

@Component({
  selector: 'app-compte-admin',
  templateUrl: './compte-admin.component.html',
  styleUrls: ['./compte-admin.component.css']
})
export class CompteAdminComponent implements OnInit {

  listeComptes:Compte[] = [];

  constructor(private compteService:CompteService) { }

  ngOnInit() {

    this.compteService.obtenirTousComptes()
                      .subscribe(res => this.listeComptes=res);

  }

}
