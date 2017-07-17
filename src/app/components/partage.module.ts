
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FooterComponent } from "./footer/footer.component";
import { ContactComponent } from "./footer/contact.component";

// Anugular Material : pour pop-up contact (bouton et overlay)
import { MdDialogModule, MdButtonModule } from "@angular/material";

// primeng
import { GrowlModule } from "primeng/primeng"; // growl pour mail contact
import { CapitalizePipe } from "./capitalize.pipe";


/** Module des composants partagés par toutes les rubriques : footer, formulaire de contact etc.
 */
@NgModule({
    imports: [ GrowlModule,MdButtonModule,MdDialogModule,FormsModule,CommonModule],
    declarations: [CapitalizePipe,ContactComponent,FooterComponent],
    exports: [CapitalizePipe,ContactComponent,FooterComponent]
})
export class PartageModule { }