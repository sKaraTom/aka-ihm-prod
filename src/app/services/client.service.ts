
import { Injectable } from "@angular/core";
import { Http, Response, Headers,RequestOptions } from "@angular/http";
import { Estimation } from "../objetmetier/estimation";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Client } from "../objetmetier/client";
import { UrlMwService } from "./url-mw.service";


@Injectable()
export class ClientService {

    private urlAka:string =  this.urlMw.urlAka;

    private headers = new Headers ({'content-type': 'application/json'});
    private token:string;

    constructor(private urlMw:UrlMwService,private http: Http) {
        this.token = localStorage.getItem('token');
        this.headers.append('Authorization', `Bearer ${this.token}`);
    }

/**
 * obtenir le nombre total de clients.
 * pas de validation de token car sert pour accueil prospect et client.
 * 
 * @return number le nombre total de clients.
 */ 
public obtenirTotalClients() : Observable<number> {
     const url = `${this.urlAka +"client/total"}`;  
     return this.http.get(url)
                     .map((response:Response) => response.json());
} 

/**
 * obtenir le nombre total de clients par sexe.
 * 
 * @param sexe 
 * @return number
 */
public obtenirTotalClientsParSexe(sexe:string) : Observable<number> {

    const url = `${this.urlAka +"client/total"}/${sexe}`;
    
    let headersAdmin:Headers = new Headers({'Content-Type': 'application/json'});
    headersAdmin.append('Authorization', `BearerAdmin ${sessionStorage.getItem('si')}`);

    let options = new RequestOptions({ headers: headersAdmin });

    return this.http.get(url,options)
                    .map((response:Response) => response.json());

}


/** 
 * obtenir client et compte associé.
 * 
 * @param refClient uuid du client. 
 * @return Client le client.
 */
public obtenirClient(refClient:string) : Observable<Client> {
    const url = `${this.urlAka +"client"}/${refClient}`;

    let headerClient:Headers = new Headers({'Content-Type': 'application/json'});
    headerClient.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

    let options = new RequestOptions({ headers: headerClient });
          
    return this.http.get(url, options)
                     .map((response:Response) => response.json())
}




} 