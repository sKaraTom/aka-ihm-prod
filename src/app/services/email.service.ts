
import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions } from "@angular/http";

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Estimation } from "../objetmetier/estimation";

@Injectable()
export class EmailService {

//  private urlAka:string = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/";
 private urlAka:String = "http://localhost:8080/akachan-0.1/ws/";
 
 private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        this.headers.append('authorization', `Bearer ${localStorage.getItem('token')}`);
     }

    /** envoyer au mw un formulaire de contact par une liste.
     * index 0. prenom client ou prospect
     * 1. email client ou prospect.
     * 2. sujet (titre)
     * 3. message
     * formulaire accessible pour client ou prospect donc pas de token envoyé.
     * @param listeChamps liste qui contient les champs saisis
     * @return un texte de confirmation si envoi effectué avec succès.
     */
    public envoyerMailContact(listeChamps:Array<String>) {
        
        const url = `${this.urlAka +"email/contact"}`;
        let options = new RequestOptions({ headers: this.headers });

        return this.http.post(url, listeChamps, options)
            .map((data:Response) =>data.text());
     }


     /** envoyer au mw une sélection de prénoms pour envoi par mail.
      * validation du token.
      * @param listePrenomsSelectionnes json : liste d'estimations (pour prénom et sexe).
      * @param prenomClient path : le prénom du client.
      * @param mailClient path : le mail du client ou "nonVoulu"
      * @param mailAutre path : un mail saisi ou "nonVoulu"
      */
     public envoyerMailSelectionPrenoms(listePrenomsSelectionnes: Estimation[], prenomClient:String,mailClient:string,mailAutre:string) {
        const url = `${this.urlAka +"email/selection"}/${prenomClient}/${mailClient}/${mailAutre}`;
        let options = new RequestOptions({ headers: this.headers });

        return this.http.post(url, listePrenomsSelectionnes, options)
            .map((data:Response) =>data.text());
     }

}