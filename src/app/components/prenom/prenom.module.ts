
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpModule } from "@angular/http";

import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { PrenomRoutingModule } from "./prenom-routing.module";
import { GenerateurComponent } from "./generateur.component";
import { PrenomService } from "../../services/prenom.service";

import {ChartModule} from 'primeng/primeng';
import { ToggleButtonModule, TooltipModule, RadioButtonModule, ButtonModule, AccordionModule, FieldsetModule, OverlayPanelModule } from "primeng/primeng";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NgSemanticModule } from "ng-semantic/ng-semantic";
import { MdRadioModule } from "@angular/material";
 

@NgModule({
  imports: [ 
    OverlayPanelModule,MdRadioModule,NgSemanticModule,NgbModule.forRoot(),ToggleButtonModule,TooltipModule,HttpModule,
    ChartModule,FieldsetModule,AccordionModule,CommonModule,FormsModule,
    RadioButtonModule,ButtonModule, PrenomRoutingModule
  ],
  declarations: [
    GenerateurComponent
  ],
  providers: [
    PrenomService
  ]
})
export class PrenomModule {}