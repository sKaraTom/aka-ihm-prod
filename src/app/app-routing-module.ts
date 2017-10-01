
import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

import { PageNotFoundComponent } from "./components/page-not-found.component";
import { AccueilGuard } from "./components/accueil/accueil.guard";
import { AuthentificationGuard } from "./services/authentification.guard";
import { ContactComponent } from "./components/footer/contact.component";
import { ContactGuard } from "./components/footer/contact.guard";
import { AdministrationComponent } from "./components/administration/administration.component";
import { LogAdminComponent } from "./components/administration/log-admin.component";
import { AdminGuard } from "./components/administration/admin.guard";
import { CitationAdminComponent } from "./components/administration/citation-admin.component";
import { CompteAdminComponent } from "./components/administration/compte-admin.component";
import { PrenomAdminComponent } from "./components/administration/prenom-admin.component";




const appRoutes: Routes = [

  {
    path: 'accueil',
    loadChildren: './components/accueil/accueil-client.module#AccueilClientModule'
  },
  {
    path: 'liste',
    loadChildren: './components/liste-akachan/liste.module#ListeModule',
    canActivate: [AuthentificationGuard]
  },
   {
    path: 'prenom',
    loadChildren: './components/prenom/prenom.module#PrenomModule',
    canActivate: [AuthentificationGuard]
  },
  {
   path:'login',
   loadChildren: './components/login-inscription/login.module#LoginModule' 
  },
  {
    path: 'compte',
    loadChildren: './components/compte/compte.module#CompteModule',
    canActivate: [AuthentificationGuard]
  },
  {
    path: 'recherche',
    loadChildren: './components/recherche/recherche.module#RechercheModule',
    canActivate: [AuthentificationGuard]
  },
  { path: 'contact', component: ContactComponent,
    canActivate: [ContactGuard] // pour éviter que la route soit accessible (uniquement en pop-up dialog).
    //redirection vers accueil.
  },  
  { path: 'admin', component: AdministrationComponent,
    canActivate: [AdminGuard],
        children : [
          { path: '', component: CompteAdminComponent},
          { path: 'prenoms', component: PrenomAdminComponent},
          { path: 'citations', component: CitationAdminComponent}
  ]
  },
  { path: 'admin-connexion', component: LogAdminComponent,
  
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
