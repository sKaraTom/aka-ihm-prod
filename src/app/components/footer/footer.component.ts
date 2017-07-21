import { Component } from "@angular/core";
import { ContactComponent } from "./contact.component";

import {MdDialog, MdDialogRef} from '@angular/material';
import { Message } from "primeng/primeng";


@Component({
  selector:"aka-footer",
  templateUrl :'./footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent {

  mailSucces : boolean;
  msgs: Message[] = []; // growl primeng

  constructor( public popUpContact: MdDialog) {}

  /**
   * ouvrir le component ContactComponent dans un modal (Angular Material)
   */
  public ouvrirPopUpContact() : void {
          let dialogRef = this.popUpContact.open(ContactComponent);
  }


}