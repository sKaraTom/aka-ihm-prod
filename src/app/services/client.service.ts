
import { Injectable } from "@angular/core";
import { Http, Response, Headers,RequestOptions } from "@angular/http";
import { Estimation } from "../objetmetier/estimation";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Client } from "../objetmetier/client";


@Injectable()
export class ClientService {

//  private urlAka:String = "https://akachan.jelastic.dogado.eu/ws/";
// private urlAka:String = "http://localhost:8080/akachan-0.1/ws/";
private urlAka:string =  "https://mw.akachan.fr/akachan-0.1/ws/"

 private headers = new Headers ({'content-type': 'application/json'});
 private token:string;

constructor(private http: Http) {
     this.token = localStorage.getItem('token');
     this.headers.append('Authorization', `Bearer ${this.token}`);
 }

/**
 * obtenir le nombre total de clients.
 * pas de validation de token car sert pour accueil prospect et client.
 * 
 * @return number le nombre total de clients.
 */ 
public obtenirTotalClients():Observable<number> {
     const url = `${this.urlAka +"client/total"}`;  
     return this.http.get(url)
                     .map((response:Response) => response.json());
} 


/** 
 * obtenir client et compte associé.
 * 
 * @param refClient uuid du client. 
 * @return Client le client.
 */
public obtenirClient(refClient:String):Observable<Client> {
    const url = `${this.urlAka +"client"}/${refClient}`;
    let options = new RequestOptions({ headers: this.headers });
          
    return this.http.get(url, options)
                     .map((response:Response) => response.json())
}




} 