


import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Estimation } from "../objetmetier/estimation";

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";


@Injectable()
export class EstimationService {

//  private urlAka:string = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/";
private urlAka:String = "http://localhost:8080/akachan-0.1/ws/";

 private headers = new Headers({'Content-Type': 'application/json'});

 private token:string;

constructor(private http: Http) { 
    this.token = localStorage.getItem('token');
    this.headers.append('Authorization', `Bearer ${this.token}`);
}


    // OBSERVABLE nombre total estimations tous clients.
    public obtenirTotalEstimations() : Observable<number> {
        return this.http.get(this.urlAka+"estimation/total")
            .map((response:Response) => response.json());    

    }

    public obtenirTop3Estimations(sexe:String) : Observable<Array<String>> {
            const url = `${this.urlAka +"estimation/top"}/${sexe}`;
            return this.http.get(url)
            .map((response:Response) => response.json());
     }

    // OBSERVABLE nombre d'estimations pour un client.
    public obtenirTotalEstimClient (refClient:String): Observable<number> {
        const url = `${this.urlAka + "estimation/stats" }/${refClient}`; 
            return this.http.get(url)
            .map((response:Response) => response.json());
    }


    //OBSERVABLE TOTAL ESTIMATIONS PAR SEXE POUR ACCUEIL CLIENT
    public obtenirTotalEstimClientParSexe(refClient:String, sexe: String): Observable<number>{
           const url = `${this.urlAka + "estimation/stats" }/${refClient}/${sexe}`; 
            return this.http.get(url)
            .map((response:Response) => response.json());
     }

     //Estimer un prénom
     public estimerPrenom(estimation: Estimation, refClient:String) {
        const url = `${this.urlAka +"estimation"}/${refClient}`;
        let options = new RequestOptions({ headers: this.headers });

        return this.http.post(url, estimation, options)
            .map((data:Response) =>data.json());
     }

    // passer plusieurs estimations (liste) de liste akachan <--> noire
    public changerDeListeEstimations(estimations:Array<Estimation>, akachan:String) {

        const url = `${this.urlAka +"estimation"}/${akachan}`;
        let options = new RequestOptions({ headers: this.headers });

        return this.http.put(url, estimations, options)
            .map((data:Response) =>data.json());
    }

    // changer une seule estimation de liste (akachan ou noire)
    public modifierEstimation(estimation:Estimation) {
        
        let options = new RequestOptions({ headers: this.headers });

        return this.http.put(this.urlAka +"estimation", estimation, options)
        .map((data:Response) =>data.json())
    }


    /** suppression de toutes les estimations d'un client.
     * option disponible pour le client dans sa page de compte.
     * @param refClient 
     */
    public supprimerToutesEstimationsClient(refClient:String) {

        const url = `${this.urlAka + "estimation" }/${refClient}`; 
        let options = new RequestOptions({ headers: this.headers });

          return this.http.delete(url,options)
                        .map((response:Response) => response.text());
    }



}