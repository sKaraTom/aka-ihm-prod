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

    
    public obtenirTotalCitations() : Observable<number> {

        const url = `${this.urlAka +"citation/total"}`;
        
                let headersAdmin = new Headers({'Content-Type': 'application/json'});
                headersAdmin.append('authorization', `BearerAdmin ${sessionStorage.getItem('si')}`);
           
                let options = new RequestOptions({ headers: headersAdmin });
           
               return this.http.get(url,options)
                                .map(res => res.json());
    }




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


}