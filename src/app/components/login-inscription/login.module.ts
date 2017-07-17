
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";
import { AuthentificationService } from "../../services/authentification.service";
import { InscriptionComponent } from "./inscription.component";
import { CompteService } from "../../services/compte.service";
import { LoginGuard } from "./login.guard";

//Angular Material
import { MdButtonModule, MaterialModule, MdInputModule } from "@angular/material";

// primeng
import { ButtonModule } from "primeng/primeng";

@NgModule({
  imports: [ 
   MdInputModule,ButtonModule,FormsModule,CommonModule,MaterialModule,MdButtonModule,LoginRoutingModule
  ],
  declarations: [
    LoginComponent,InscriptionComponent
  ],
  exports:[LoginComponent],
  providers: [
    LoginGuard,AuthentificationService,CompteService,LoginComponent
  ]
})
export class LoginModule {}