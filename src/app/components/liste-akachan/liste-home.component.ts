
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { TabMenuModule, MenuItem } from 'primeng/primeng';
import { Observable } from "rxjs/Observable";
import { AuthentificationService } from "../../services/authentification.service";



@Component({
    selector:'liste-home',
    templateUrl : './liste-home.component.html',
    styleUrls: ['./liste-home.component.css'],
    })
export class ListeHomeComponent implements OnInit {



    private items: MenuItem[];
    private listeActiveDefaut: MenuItem;
    
    private isAuthentifie:boolean = false;
    private idClient: string;


 constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService:AuthentificationService
    ) { }


ngOnInit() {
    
    // construire le sous-menu (tab)
    this.items = [
            {label: 'Ma liste Akachan', icon: 'fa fa-star-half red', routerLink: ['./']},
            {label: 'Changer d\'avis ?', icon: 'fa-support',routerLink: ['n']}
    ];
        
   

}




}   