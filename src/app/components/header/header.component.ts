import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthentificationService } from "../../services/authentification.service";

@Component({
  selector: 'aka-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public prenomClient : string;

   public constructor (private authService:AuthentificationService,
                        public router: Router,){ 

        this.authService.prenomClientSource.next(localStorage.getItem('prenom'));
        //this.authService.idClientSource.next(localStorage.getItem('id'));
    }
    

    ngOnInit(){
        this.authService.prenomClientObs.subscribe(
        res => { if(res) { this.prenomClient = res; }
                else { this.prenomClient = null;  }
        });
       
    } 


  public deconnecter(event:Event):void {
        event.preventDefault();
        this.authService.deconnecter();
        this.router.navigateByUrl('/accueil');
        event.stopPropagation();
  }
}
