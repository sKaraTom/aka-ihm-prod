
import { Injectable } from "@angular/core";
import { Http, Response, Headers,RequestOptions } from "@angular/http";
import { Estimation } from "../objetmetier/estimation";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Client } from "../objetmetier/client";


@Injectable()
export class ClientService {

//  private urlAka:String = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/";
private urlAka:String = "http://localhost:8080/akachan-0.1/ws/";

 private headers = new Headers ({'content-type': 'application/json'});
 private token:string;

constructor(private http: Http) {
     this.token = localStorage.getItem('token');
     this.headers.append('Authorization', `Bearer ${this.token}`);
 }

// pas de validation de token car sert pour accueil prospect et client.
public obtenirTotalClients():Observable<number> {
     const url = `${this.urlAka +"client/total"}`;  
     return this.http.get(url)
                     .map((response:Response) => response.json());
} 


/** obtenir client et compte associé.
 * envoi du token.
 * @param refClient uuid du client. 
 */
public obtenirClient(refClient:String):Observable<Client> {
    const url = `${this.urlAka +"client"}/${refClient}`;
    let options = new RequestOptions({ headers: this.headers });
          
    return this.http.get(url, options)
                     .map((response:Response) => response.json())
}


 //OBSERVABLE Liste Akachan
 public obtenirListeAkachan(refClient:String): Observable<Array<Estimation>>{
         const url = `${this.urlAka +"client/listeA"}/${refClient}`;
         let options = new RequestOptions({ headers: this.headers });
          
            return this.http.get(url, options)
                    .map((response:Response) => response.json())
     }


 //OBSERVABLE Liste noire
 public obtenirListeNoire(refClient:String): Observable<Array<Estimation>>{
         const url = `${this.urlAka +"client/listeN"}/${refClient}`;
          let options = new RequestOptions({ headers: this.headers });
        
            return this.http.get(url, options)
            .map((response:Response) => response.json());
     }

 //OBSERVABLE Liste favoris
 public obtenirListeFavoris(refClient:String): Observable<Array<Estimation>>{
         const url = `${this.urlAka +"client/listeF"}/${refClient}`;
            return this.http.get(url)
            .map((response:Response) => response.json());
     }


} 