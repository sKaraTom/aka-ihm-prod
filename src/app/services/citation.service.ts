import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Http, Response, Headers,RequestOptions } from "@angular/http";

import { Citation } from "../objetmetier/citation";
import { UrlMwService } from "./url-mw.service";





@Injectable()
export class CitationService {

    private urlAka:string =  this.urlMw.urlAka;

    private headers = new Headers ({'content-type': 'application/json'});
    private token:string;

    constructor(private urlMw:UrlMwService,private http: Http) {
        this.token = localStorage.getItem('token');
        this.headers.append('Authorization', `Bearer ${this.token}`);
    }

    /**
     * obtenir le nombre total de citations en base
     */
    public obtenirTotalCitations() : Observable<number> {

        const url = `${this.urlAka +"citation/total"}`;
        
                let headersAdmin = new Headers({'Content-Type': 'application/json'});
                headersAdmin.append('authorization', `BearerAdmin ${sessionStorage.getItem('si')}`);
           
                let options = new RequestOptions({ headers: headersAdmin });
           
               return this.http.get(url,options)
                                .map(res => res.json());
    }



    /**
     * obtenir la liste de toutes les citations
     */
    public obtenirListeCitations() : Observable<Array<Citation>> {

        const url = `${this.urlAka +"citation"}`;

        let headersAdmin = new Headers({'Content-Type': 'application/json'});
        headersAdmin.append('authorization', `BearerAdmin ${sessionStorage.getItem('si')}`);
   
        let options = new RequestOptions({ headers: headersAdmin });
   
       return this.http.get(url,options)
                        .map(res => res.json());
    }

    /**
    * Obtenir une citation aléatoire
    * destination : accueil prospect et client (pas d'envoi de token).
    *
    * @return Citation une citation aléatoire.
    */
    public obtenirCitationAleatoire(): Observable<Citation>{
        const url = `${this.urlAka +"citation/aleatoire"}`;
        
        return this.http.get(url)
                .map((response:Response) => response.json())
    }
    
    /**
     * supprimer un compte
     * 
     * @param id    
     */
    public supprimerCitation(id:number) : Observable<String> {

        const url = `${this.urlAka +"citation"}/${id}`;
        
        let headersAdmin = new Headers({ 'Content-Type': 'application/json' });
        headersAdmin.append('Authorization', `BearerAdmin ${sessionStorage.getItem('si')}`);

        let options = new RequestOptions({ headers: headersAdmin });

        return this.http.delete(url,options)
                        .map(res => res.text());
    }

}