
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { compteRoutingModule } from "./compte.routing";
import { CompteComponent } from "./compte.component";
import { AuthentificationGuard } from "../../services/authentification.guard";
import { CompteService } from "../../services/compte.service";
import { ClientService } from "../../services/client.service";

import { ButtonModule, ConfirmDialogModule, ConfirmationService, GrowlModule } from "primeng/primeng";
import { MdButtonModule,MdInputModule,MaterialModule } from "@angular/material";

@NgModule({
  imports: [ GrowlModule,ConfirmDialogModule,MaterialModule,MdButtonModule,MdInputModule,ButtonModule,CommonModule,FormsModule,compteRoutingModule ],
  declarations: [CompteComponent  ],
  providers: [
    AuthentificationGuard, CompteService,ClientService,ConfirmationService
  ]
})
export class CompteModule { }