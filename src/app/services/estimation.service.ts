


import { Injectable } from "@angular/core";
import { Headers, Http, Response, RequestOptions } from "@angular/http";
import { Estimation } from "../objetmetier/estimation";

import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { UrlMwService } from "./url-mw.service";


@Injectable()
export class EstimationService {

    private urlAka:string =  this.urlMw.urlAka;

    private headers = new Headers({'Content-Type': 'application/json'});

    private token:string;

    constructor(private urlMw:UrlMwService,private http: Http) { 
        this.token = localStorage.getItem('token');
        this.headers.append('Authorization', `Bearer ${this.token}`);
    }


    /**
     * obtenir le nombre total d'estimations tous clients confondus.
     * 
     * @return number nombre total
     */
    public obtenirTotalEstimations() : Observable<number> {
        return this.http.get(this.urlAka+"estimation/total")
            .map((response:Response) => response.json());    

    }

    /**
     * obtenir les 3 prénoms les plus estimés positivement
     * pour un sexe donné.
     * 
     * @param sexe
     * @return Array<String> les 3 prénoms plus aimés.
     */
    public obtenirTop3Estimations(sexe:String) : Observable<Array<String>> {
            const url = `${this.urlAka +"estimation/top"}/${sexe}`;
            return this.http.get(url)
            .map((response:Response) => response.json());
     }

    /**
     * obtenir le nombre total d'estimations pour un client.
     * 
     * @param refClient
     * @return number nombre total estimations d'un client.
     */
    public obtenirTotalEstimClient (refClient:String): Observable<number> {
        const url = `${this.urlAka + "estimation/stats" }/${refClient}`;

            return this.http.get(url)
            .map((response:Response) => response.json());
    }


    /**
     * obtenir le nombre total d'estimations d'un client
     * pour un sexe donné.
     * 
     * @param refClient 
     * @param sexe 
     * @return number le nombtre total d'estimations d'un client.
     */
    public obtenirTotalEstimClientParSexe(refClient:String, sexe: String): Observable<number>{
            const url = `${this.urlAka + "estimation/stats" }/${refClient}/${sexe}`; 

            return this.http.get(url)
            .map((response:Response) => response.json());
     }

     /**
      * obtenir la liste Akachan d'un client
      *
      * @param refClient
      * @return Array<Estimation> la liste Akachan
      */
    public obtenirListeAkachan(refClient:String): Observable<Array<Estimation>>{
            const url = `${this.urlAka +"estimation/listeA"}/${refClient}`;
            let options = new RequestOptions({ headers: this.headers });
            
            return this.http.get(url, options)
                    .map((response:Response) => response.json())
        }


    /**
     * obtenir la liste noire d'un client
     * 
     * @param refClient
     * @return Array<Estimation> la liste noire
     */
    public obtenirListeNoire(refClient:String): Observable<Array<Estimation>>{
            const url = `${this.urlAka +"estimation/listeN"}/${refClient}`;
            let options = new RequestOptions({ headers: this.headers });
            
            return this.http.get(url, options)
                .map((response:Response) => response.json());
        }

    /**
     * obtenir la liste des prénoms favoris d'un client
     * 
     * @param refClient
     * @return  Array<Estimation> liste des estimations avec estimation.favori=true.
     */
    public obtenirListeFavoris(refClient:String): Observable<Array<Estimation>>{
            const url = `${this.urlAka +"estimation/listeF"}/${refClient}`;

            return this.http.get(url)
                .map((response:Response) => response.json());
        }


    /**
     * estimer un prénom
     * 
     * @param estimation l'estimation à créer
     * @param refClient
     * @return l'estimation créée.
     */
     public estimerPrenom(estimation: Estimation, refClient:String) {
        const url = `${this.urlAka +"estimation"}/${refClient}`;
        let options = new RequestOptions({ headers: this.headers });

        return this.http.post(url, estimation, options)
            .map((data:Response) =>data.json());
     }

    /**
     * changer de liste Akachan <--> noire une liste d'estimations.
     * 
     * @param estimations Array<Estimation>
     * @param akachan
     * @return Array<Estimation> la liste des estimations modifiées.
     */
    public changerDeListeEstimations(estimations:Array<Estimation>, akachan:String) {

        const url = `${this.urlAka +"estimation"}/${akachan}`;
        let options = new RequestOptions({ headers: this.headers });

        return this.http.put(url, estimations, options)
            .map((data:Response) =>data.json());
    }

    /**
     * modifier une estimation
     * 
     * @param estimation
     * @return l'estimation modifiée
     */
    public modifierEstimation(estimation:Estimation) {
        
        let options = new RequestOptions({ headers: this.headers });

        return this.http.put(this.urlAka +"estimation", estimation, options)
        .map((data:Response) =>data.json())
    }


    /** 
     * suppression de toutes les estimations d'un client.
     * 
     * @param refClient
     * @return string un message de confirmation succès.
     */
    public supprimerToutesEstimationsClient(refClient:String) {

        const url = `${this.urlAka + "estimation" }/${refClient}`; 
        let options = new RequestOptions({ headers: this.headers });

          return this.http.delete(url,options)
                        .map((response:Response) => response.text());
    }



}