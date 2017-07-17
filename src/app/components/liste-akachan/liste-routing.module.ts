import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeHomeComponent } from "./liste-home.component";
import { AuthentificationGuard } from "../../services/authentification.guard";
import { ListeAkachanComponent } from "./liste-akachan.component";
import { ListeNoireComponent } from "./liste-noire.component";




const listeRoutes: Routes = [
    
    { path: '', component: ListeHomeComponent,
      canActivate: [AuthentificationGuard],
              children : [{ path: '',
                            // canActivateChild: [AuthentificationGuard], 
                            // si guard inutile ici, remonter d'un niveau les sous-rubriques. 
                              children : [
                                  { path: '', component: ListeAkachanComponent},
                                  { path: 'n', component: ListeNoireComponent}
                              ]
              }]
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