
import { Injectable } from "@angular/core";
import { Http, Headers,RequestOptions,Response } from "@angular/http";
import { Compte } from "../objetmetier/compte";

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";


@Injectable()
export class CompteService {

    // private urlAka:String = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/compte/";
    private urlAka:String = "http://localhost:8080/akachan-0.1/ws/compte/";

    private headers = new Headers({'Content-Type': 'application/json'});
    private headersForm = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

     private token:string;

constructor(private http: Http) {
     this.token = localStorage.getItem('token');
     this.headers.append('Authorization', `Bearer ${this.token}`);
     this.headersForm.append('Authorization', `Bearer ${this.token}`);
}


     /** 
     * création d'un compte
     * 
     * @param compte objet de type Compte envoyé en json.
     * @return string message succès.
     */
    public creerCompte(compte:Compte) {
        const url = `${this.urlAka +"creer"}`;

        return this.http.post(url, compte)
                .map(data =>data.text());
    }


    /**
     * obtenir un compte
     * 
     * @param email
     * @return le compte du client. 
     */
    public obtenirCompte(email:string):Observable<Compte> {

        const url = `${this.urlAka +"obtenir"}`;
        
        //header form param + passer token dans 'authorization'
        let options = new RequestOptions({ headers: this.headersForm });
        // pour passer l'email en FormParam
        let body = `email=${email}`;
        
        return this.http.post(url,body,options)
                        .map(response => response.json())
    }


    /** 
     * modifier un compte existant.
     * 
     * @param compte objet de type Compte envoyé en json.
     * @return le compte
     */
    public modifierCompte(compte:Compte):Observable<Compte> {

        const url = `${this.urlAka +"modifier"}`;
        let options = new RequestOptions({ headers: this.headers });
        
        return this.http.put(url,compte,options)
                        .map((response:Response) => response.json());
    }

    /**
     * modifier un mot de passe.
     * envoyer une liste Array<String> contenant les champs.
     * 
     * @param email du client.
     * @param passwordActuel 
     * @param nouveauPassword
     * @return string message succès. 
     */
    public modifierMotDePasse(email:string, passwordActuel:string, nouveauPassword:string) {
         
        const url = `${this.urlAka +"modifier/password"}`;
        let options = new RequestOptions({ headers: this.headers });

        let listeChamps : Array<String> = new Array<String>();
        listeChamps.push(email,passwordActuel,nouveauPassword);

        return this.http.put(url,listeChamps,options)
                        .map((response:Response) => response.text());
    }


  

}