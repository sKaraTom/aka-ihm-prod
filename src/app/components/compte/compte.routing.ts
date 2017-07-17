
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationGuard } from "../../services/authentification.guard";
import { CompteComponent } from "./compte.component";



const compteRoutes: Routes = [
  { path: '', component: CompteComponent,
          canActivate: [AuthentificationGuard]
  }];


@NgModule({
  imports: [
    RouterModule.forChild(compteRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class compteRoutingModule { }