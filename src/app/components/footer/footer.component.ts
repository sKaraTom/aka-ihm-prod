import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ChangeDetectionStrategy } from "@angular/core";
import { ContactComponent } from "./contact.component";

import {MdDialog, MdDialogRef} from '@angular/material';
import { Message } from "primeng/primeng";
import { Router } from "@angular/router";


@Component({
  selector:"aka-footer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl :'./footer.component.html',
    styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {

  mailSucces : boolean;
  msgs: Message[] = []; // growl primeng


  constructor( public popUpContact: MdDialog, private router:Router) {}
  
  ngOnInit(): void {
  }



  /**
   * ouvrir le component ContactComponent dans un modal (Angular Material)
   */
  public ouvrirPopUpContact() : void {
          let dialogRef = this.popUpContact.open(ContactComponent);
  }

  private accesAdmin() : void {
    this.router.navigate(['/admin']);
  }


}