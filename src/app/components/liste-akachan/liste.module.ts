import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule} from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

//primeng
import {TabMenuModule,MenuItem} from 'primeng/primeng';
import { DataTableModule, SharedModule, ContextMenuModule, OverlayPanelModule,
   CheckboxModule, ButtonModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService, GrowlModule } from 'primeng/primeng';
import { ChartModule, DropdownModule, InputTextModule, DialogModule } from 'primeng/primeng';

//boostrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

//Semantic
import { NgSemanticModule } from "ng-semantic/ng-semantic";

//Angular Material
import { MdTooltipModule, MdCheckboxModule } from "@angular/material";

import { ListeRoutingModule } from "./liste-routing.module";
import { ListeHomeComponent } from "./liste-home.component";
import { ListeAkachanComponent } from "./liste-akachan.component";
import { ListeNoireComponent } from "./liste-noire.component";
import { GenrePipe } from "../genre.pipe";
import { ClientService } from "../../services/client.service";
import { PrenomService } from "../../services/prenom.service";
import { EstimationService } from "../../services/estimation.service";
import { PartageModule } from "../partage.module";
import { EmailService } from "../../services/email.service";
import { AuthentificationService } from "../../services/authentification.service";




@NgModule({
  imports: [ 
   MdCheckboxModule,DialogModule,MdTooltipModule,InputTextModule,DropdownModule,ChartModule,NgSemanticModule,GrowlModule,ConfirmDialogModule,ButtonModule,NgbModule.forRoot(),CheckboxModule,
   OverlayPanelModule,ContextMenuModule,SharedModule,DataTableModule,
   TabMenuModule,CommonModule,FormsModule,PartageModule,ListeRoutingModule
  ],
  declarations: [ 
   ListeHomeComponent,ListeAkachanComponent,ListeNoireComponent
  ],
   providers: [
    AuthentificationService,ConfirmationService,ClientService,PrenomService,EstimationService,EmailService
   ]
})
export class ListeModule {}