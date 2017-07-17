

import { Injectable } from "@angular/core";
import { Http,Response } from "@angular/http";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable"

import { PrenomInsee } from "../objetmetier/prenominsee";
import { Estimation } from "../objetmetier/estimation";


@Injectable()
export class PrenomService {

    private urlAka:String = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/";

    constructor(private http: Http) { }

      //OBSERVABLE PRENOM ALEATOIRE
  public getPrenomAleatoire(choixSexe:String, refClient:String, choixTendance:Number): Observable<String> {
     const url = `${this.urlAka + "prenom" }/${choixSexe}/${refClient}/${choixTendance}`;
        return this.http.get(url)
                        .map((response:Response) => response.text());
  }

    //OBSERVABLE NOMBRE DE NAISSANCES ENTRE 1900 et 2015
    public getNaissances(prenom: String, sexe: String): Observable<Number[]>{
           const url = `${this.urlAka + "prenom/pop" }/${sexe}/${prenom}`; 
            return this.http.get(url)
            .map((response:Response) => response.json());
     }
    
      // OBSERVABLE RECHERCHE DE PRENOM : retourne un tableau de prénoms (SQL LIKE ou 1 prenom si recherche exacte)
     public rechercherPrenomEtEstimExistante(estimation:Estimation, rechercheExacte:boolean){
           const url = `${this.urlAka + "prenom/recherche" }/${rechercheExacte}`;
            return this.http.post(url,estimation)
            .map((response:Response) => {
              if(response.status != 200) {
                return response.status }
              else{
               return response.json();
              }
            }
            );
     }

}
