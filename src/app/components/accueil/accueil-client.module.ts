import { NgModule } from "@angular/core";

import { RouterModule, Routes, Router } from '@angular/router';
import { HttpModule } from "@angular/http";

import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

// Boostrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';

// primeng
import { GalleriaModule,ButtonModule } from 'primeng/primeng';
import { ChartModule } from 'primeng/primeng';

// Angular Material

//Semantic
import { NgSemanticModule } from "ng-semantic/ng-semantic";

import { AccueilClientGuard } from "./accueil-client.guard";
import { AccueilComponent } from "./accueil.component";
import { AccueilClientComponent } from "./accueil-client.component";
import { AccueilGuard } from "./accueil.guard";
import { AccueilClientRoutingModule } from "./accueil-client.routing";
import { ClientService } from "../../services/client.service";
import { PartageModule } from "../partage.module";
import { CitationService } from "../../services/citation.service";
import { EstimationService } from "../../services/estimation.service";
import { CitationComponent } from "./citation.component";



@NgModule({
  imports: [ChartModule,NgSemanticModule,ButtonModule,GalleriaModule,NgbModule,CarouselModule,
  HttpModule,CommonModule,FormsModule,PartageModule,AccueilClientRoutingModule
        ],
  declarations: [
    CitationComponent,AccueilComponent,AccueilClientComponent
  ],
  providers: [
    CitationService,AccueilGuard,AccueilClientGuard,EstimationService,ClientService
  ]
})
export class AccueilClientModule {}