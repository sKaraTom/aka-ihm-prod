
import { Injectable } from "@angular/core";
import { Http, Headers,RequestOptions,Response } from "@angular/http";
import { Compte } from "../objetmetier/compte";

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";


@Injectable()
export class CompteService {

    private urlAka:String = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/compte/";

    private headers = new Headers({'Content-Type': 'application/json'});
    private headersForm = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

     private token:string;

constructor(private http: Http) {
     this.token = localStorage.getItem('token');
     this.headers.append('Authorization', `Bearer ${this.token}`);
     this.headersForm.append('Authorization', `Bearer ${this.token}`);
}

    // INUTILISE POUR L'INSTANT
    // public obtenirCompte(email:string):Observable<Compte> {

    //     const url = `${this.urlAka +"obtenir"}`;
        
    //     //header form param + passer token dans 'authorization'
    //     let options = new RequestOptions({ headers: this.headersForm });
    //     // pour passer l'email en FormParam
    //     let body = `email=${email}`;
        
    //     return this.http.post(url,body,options)
    //                     .map(response => response.json())
    // }


    /** modifier un compte existant.
     * envoi du token.
     * @param compte objet de type Compte envoyé en json.
     */
    public modifierCompte(compte:Compte):Observable<Compte> {

        const url = `${this.urlAka +"modifier"}`;
        let options = new RequestOptions({ headers: this.headers });
        
        return this.http.put(url,compte,options)
                        .map((response:Response) => response.json());
    }


    public modifierMotDePasse(email:string, passwordActuel:string, nouveauPassword:string) {
         
        const url = `${this.urlAka +"modifier/password"}`;
        let options = new RequestOptions({ headers: this.headers });

        let listeChamps : Array<String> = new Array<String>();
        listeChamps.push(email,passwordActuel,nouveauPassword);

        return this.http.put(url,listeChamps,options)
                        .map((response:Response) => response.text());
    }


    /** création d'un compte
     * envoi du token.
     * @param compte objet de type Compte envoyé en json.
     */
    public creerCompte(compte:Compte) {
            const url = `${this.urlAka +"creer"}`;
            let options = new RequestOptions({ headers: this.headers });

            return this.http.post(url, compte, options)
            .map(data =>data.json());
    }

}