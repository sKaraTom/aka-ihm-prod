
import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

import { PageNotFoundComponent } from "./components/page-not-found.component";
import { AccueilGuard } from "./components/accueil/accueil.guard";
import { AuthentificationGuard } from "./services/authentification.guard";
import { ContactComponent } from "./components/footer/contact.component";
import { ContactGuard } from "./components/footer/contact.guard";




const appRoutes: Routes = [

  {
    path: 'accueil',
    loadChildren: './components/accueil/accueil-client.module#AccueilClientModule'
  },
  {
    path: 'liste',
    loadChildren: './components/liste-akachan/liste.module#ListeModule',
    canLoad: [AuthentificationGuard]
  },
   {
    path: 'prenom',
    loadChildren: './components/prenom/prenom.module#PrenomModule',
    canLoad: [AuthentificationGuard]
  },
  {
   path:'login',
   loadChildren: './components/login-inscription/login.module#LoginModule' 
  },
  {
    path: 'compte',
    loadChildren: './components/compte/compte.module#CompteModule',
    canLoad: [AuthentificationGuard]
  },
  {
    path: 'recherche',
    loadChildren: './components/recherche/recherche.module#RechercheModule',
    canLoad: [AuthentificationGuard]
  },
  { path: 'contact', component: ContactComponent,
    canActivate: [ContactGuard] // pour éviter que la route soit accessible (uniquement en pop-up dialog).
    //redirection vers accueil.
  },  
  
  { path: '', redirectTo: '/accueil/cli', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
