import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { BrowserModule} from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// primeng
import { GalleriaModule,ContextMenuModule,OverlayPanelModule, DialogModule,ConfirmDialogModule,RadioButtonModule,
         MenuModule, DropdownModule, SpinnerModule, 
        InputTextModule, InputMaskModule, ButtonModule,
        DataTableModule,SharedModule, InputSwitchModule, GrowlModule, CheckboxModule } from 'primeng/primeng';

// Boostrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from'./components/app.component';
import { PageNotFoundComponent } from './components/page-not-found.component';
import { AppRoutingModule } from "./app-routing-module";

// Angular-material : loginComponent notamment.
import { MaterialModule, MdInputModule, MdButtonModule, MdTooltipModule, MdMenuModule } from '@angular/material';

//Semantic
import { NgSemanticModule } from 'ng-semantic/ng-semantic';

import { AccueilGuard } from "./components/accueil/accueil.guard";
import { EstimationService } from "./services/estimation.service";
import { AuthentificationGuard } from "./services/authentification.guard";
import { AuthentificationService } from "./services/authentification.service";
import { PartageModule } from "./components/partage.module";
import { EmailService } from "./services/email.service";
import { ClientService } from "./services/client.service";
import { HeaderComponent } from "./components/header/header.component";
import { MenuComponent } from "./components/menu/menu.component";
import { ContactGuard } from "./components/footer/contact.guard";


@NgModule({
    imports:[ MdMenuModule,NgSemanticModule,MdTooltipModule,MdButtonModule,MdInputModule,GalleriaModule, MaterialModule,
    NgbModule.forRoot(),BrowserAnimationsModule,CommonModule,ContextMenuModule,
    OverlayPanelModule,DialogModule,ConfirmDialogModule,SharedModule,
     RadioButtonModule, CheckboxModule, BrowserModule, MenuModule, DropdownModule,
     SpinnerModule, InputTextModule, InputMaskModule,ButtonModule, HttpModule, FormsModule,
     DataTableModule, InputSwitchModule, GrowlModule,PartageModule,AppRoutingModule
            ],
    declarations:[ 
    AppComponent,PageNotFoundComponent, HeaderComponent, MenuComponent
     ],
     exports:[],
    bootstrap: [ AppComponent ],
    providers: [ContactGuard,ClientService,EmailService,AccueilGuard,EstimationService,AuthentificationGuard, AuthentificationService]
})
 
export class AppModule{

}
