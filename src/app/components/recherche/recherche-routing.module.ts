
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RechercheComponent } from "./recherche.component";
import { AuthentificationGuard } from "../../services/authentification.guard";



const rechercheRoutes: Routes = [
  { path: '', component: RechercheComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(rechercheRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class RechercheRoutingModule {}
