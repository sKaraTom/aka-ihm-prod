
import { Injectable } from "@angular/core";
import { Http, Headers,RequestOptions,Response } from "@angular/http";
import { Compte } from "../objetmetier/compte";

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { UrlMwService } from "./url-mw.service";


@Injectable()
export class CompteService {

    private urlAka:string =  this.urlMw.urlAka;

    private headers = new Headers({'Content-Type': 'application/json'});
    private headersForm = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

     private token:string;

constructor(private urlMw:UrlMwService,private http: Http) {
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
        const url = `${this.urlAka +"compte/creer"}`;

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

        const url = `${this.urlAka +"compte/obtenir"}`;
        
        //header form param + passer token dans 'authorization'
        let options = new RequestOptions({ headers: this.headersForm });
        // pour passer l'email en FormParam
        let body = `email=${email}`;
        
        return this.http.post(url,body,options)
                        .map(response => response.json())
    }

    /**
     * obtenir la liste des tous les comptes (interface ADMIN)
     * 
     * @return liste de comptes sans données sensibles.
     */
    public obtenirTousComptes():Observable<Array<Compte>> {
        
        const url = `${this.urlAka +"compte/admin/comptes"}`;

        let headersAdmin:Headers = new Headers({'Content-Type': 'application/json'});
        headersAdmin.append('Authorization', `BearerAdmin ${sessionStorage.getItem('si')}`);

        let options = new RequestOptions({ headers: headersAdmin });

        return this.http.get(url,options)
                        .map(res => res.json())

    }


    /** 
     * modifier un compte existant.
     * 
     * @param compte objet de type Compte envoyé en json.
     * @return le compte
     */
    public modifierCompte(compte:Compte):Observable<Compte> {

        const url = `${this.urlAka +"compte/modifier"}`;
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
         
        const url = `${this.urlAka +"compte/modifier/password"}`;
        let options = new RequestOptions({ headers: this.headers });

        let listeChamps : Array<String> = new Array<String>();
        listeChamps.push(email,passwordActuel,nouveauPassword);

        return this.http.put(url,listeChamps,options)
                        .map((response:Response) => response.text());
    }


  

}