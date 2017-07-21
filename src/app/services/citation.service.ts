import { Injectable } from "@angular/core";
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { Http, Response, Headers,RequestOptions } from "@angular/http";

import { Citation } from "../objetmetier/citation";





@Injectable()
export class CitationService {

// private urlAka:String = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/";
private urlAka:String = "http://localhost:8080/akachan-0.1/ws/";

private headers = new Headers ({'content-type': 'application/json'});
private token:string;

constructor(private http: Http) {
     this.token = localStorage.getItem('token');
     this.headers.append('Authorization', `Bearer ${this.token}`);
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