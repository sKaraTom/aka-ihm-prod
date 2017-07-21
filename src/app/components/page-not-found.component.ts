

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component ({
  selector: 'non-trouve',
  templateUrl :'./page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
    
    constructor(private router:Router){}


    ngOnInit(): void {
      
    }

    /**
     * méthode de redirection vers l'accueil
     */
    retournerALAccueil():void {
        this.router.navigate(['/accueil/cli']);

    }

}  