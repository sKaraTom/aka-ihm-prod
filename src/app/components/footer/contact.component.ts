import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { EmailService } from "../../services/email.service";
import { ClientService } from "../../services/client.service";
import { Client } from "../../objetmetier/client";
import { MdDialogRef } from "@angular/material";




@Component({
  selector:"contact",
  templateUrl :'./contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit  {

  prenomClient:string;
  mailClient:string;

  estDesactive:boolean = false;

  // ces variables ne servent qu'à vider les champs après submit.
  sujetMail : string;
  messageClient : string = "";

  // messages succès/erreur
  messageSucces : string;
  messageErreur : string;

  constructor(private emailService:EmailService,
              private clientService:ClientService,
              public dialogRef: MdDialogRef<ContactComponent>) {}

  ngOnInit(): void {
    
    this.prenomClient = localStorage.getItem("prenom");
    
    if(localStorage.getItem('id')) {
        this.obtenirClient();
        this.estDesactive = true;
    }

  }

  private obtenirClient() : void {
      
      this.clientService.obtenirClient(localStorage.getItem("id"))
                        .subscribe(res => this.mailClient=res.compte.email
                        );
  }

  /**
   * 
   * @param formContact 
   */
  private envoyerMail(formContact:NgForm) :void {

    let listeChamps : Array<String> = new Array<String>();
    
    if(formContact.valid) {
      listeChamps.push(this.prenomClient); // champ disabled si client donc utiliser variable 2 way binding.
      listeChamps.push(this.mailClient); // idem
      listeChamps.push(formContact.value.sujet);
      listeChamps.push(formContact.value.message);

      this.emailService.envoyerMailContact(listeChamps)
                        .subscribe(res => this.messageSucces = res,
                        err => {this.messageErreur = err._body;
                                setTimeout(() => { this.messageErreur = null; }, 4000); },
                        () => {
                          this.sujetMail = "";
                          this.messageClient="";
                        }
                        );
    }

    else {
        this.messageErreur = "tous les champs doivent être renseignés.";
        setTimeout(() => { this.messageErreur = null; }, 4000); 
    }

  } 


}