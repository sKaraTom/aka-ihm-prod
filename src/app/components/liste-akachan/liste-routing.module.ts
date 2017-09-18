import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeHomeComponent } from "./liste-home.component";
import { AuthentificationGuard } from "../../services/authentification.guard";
import { ListeAkachanComponent } from "./liste-akachan.component";
import { ListeNoireComponent } from "./liste-noire.component";




const listeRoutes: Routes = [
    
    { path: '', component: ListeHomeComponent,
              children : [
                  { path: '', component: ListeAkachanComponent},
                  { path: 'n', component: ListeNoireComponent}
              ]
    }
];


@NgModule({
  imports: [
    RouterModule.forChild(listeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ListeRoutingModule { }