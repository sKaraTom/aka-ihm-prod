
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { RechercheComponent } from "./recherche.component";
import { RechercheRoutingModule } from "./recherche-routing.module";
import { MdRadioModule, MdCheckboxModule } from "@angular/material";
import { PrenomService } from "../../services/prenom.service";
import { DataListModule, ChartModule, OverlayPanelModule, GrowlModule, ButtonModule } from "primeng/primeng";
import { PartageModule } from "../partage.module";





@NgModule({
  imports: [ 
   MdCheckboxModule,ButtonModule,GrowlModule,OverlayPanelModule,ChartModule,DataListModule,MdRadioModule,FormsModule,CommonModule,PartageModule,RechercheRoutingModule
  ],
  declarations: [
    RechercheComponent
  ],
  exports:[],
  providers: [ PrenomService
    
  ]
})
export class RechercheModule {}