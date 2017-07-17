import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from "./accueil.component";
import { AccueilGuard } from "./accueil.guard";
import { AccueilClientComponent } from "./accueil-client.component";
import { AccueilClientGuard } from "./accueil-client.guard";




const accueilClientRoutes: Routes = [

  { path: '', component: AccueilComponent,
   canActivate: [AccueilGuard]
  },
  { path: 'cli', component: AccueilClientComponent,
          canActivate: [AccueilClientGuard]
  }
  ];
 

@NgModule({
  imports: [
    RouterModule.forChild(accueilClientRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccueilClientRoutingModule { }