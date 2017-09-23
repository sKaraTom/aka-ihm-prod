import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { Router } from "@angular/router";
import { AuthentificationService } from "../../services/authentification.service";

@Component({
  selector: 'aka-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewChecked {

  public prenomClient : string;

  // private prenomEmis: string;

   public constructor (private changeDetectionRef : ChangeDetectorRef,
                        private authService:AuthentificationService,
                        public router: Router,){ 
          // this.authService.prenomEmis.subscribe(res => this.prenomEmis = res);
    }
    

    ngOnInit(){
        
      this.authService.prenomClientObs.subscribe(
        res => { 
            if(res) { this.prenomClient = res; 
                      this.changeDetectionRef.markForCheck(); // permet de détecter le changement de valeur 
                    }
            else    { this.prenomClient = null;
                      this.changeDetectionRef.markForCheck(); }
        });
       
    } 


    ngAfterViewChecked() : void {
      this.changeDetectionRef.detectChanges();
    }

  /**
   * déconnecter un client et redirection vers accueil prospect.
   * 
   * @param event 
   */
  public deconnecter(event:Event):void {
        event.preventDefault();
        this.authService.deconnecter();
        this.router.navigateByUrl('/accueil');
        event.stopPropagation();
  }
}
