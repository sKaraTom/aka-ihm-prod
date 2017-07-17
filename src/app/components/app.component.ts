import { Component, OnInit } from '@angular/core';

import { Client } from "../objetmetier/client";
import { AuthentificationService } from "../services/authentification.service";
import { Router } from "@angular/router";


@Component({
    selector:'akachan',
    templateUrl:'./app.component.html',
    styleUrls: ['./app.component.css'],
    
    providers:  [AuthentificationService]
})

export class AppComponent implements OnInit {
        

    public constructor (){ 
    }
    

    ngOnInit(){
    } 



}