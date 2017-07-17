import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { InscriptionComponent } from "./inscription.component";
import { LoginGuard } from "./login.guard";



const loginRoutes: Routes = [
  { path: '', component: LoginComponent,
        canActivate: [LoginGuard] },
  { path: 'inscription', component: InscriptionComponent,
        canActivate: [LoginGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRoutingModule {}
