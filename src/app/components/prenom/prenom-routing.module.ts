
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GenerateurComponent } from "./generateur.component";
import { AuthentificationGuard } from "../../services/authentification.guard";


const prenomRoutes: Routes = [
  { path: '', component: GenerateurComponent,
          canActivate: [AuthentificationGuard]
  }];


@NgModule({
  imports: [
    RouterModule.forChild(prenomRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class PrenomRoutingModule { }