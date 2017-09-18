

import { Injectable } from "@angular/core";
import { Http, Response, Headers,RequestOptions } from "@angular/http";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable"

import { Estimation } from "../objetmetier/estimation";


@Injectable()
export class PrenomService {

    // private urlAka:String = "https://akachan.jelastic.dogado.eu/ws/";
    // private urlAka:String = "http://localhost:8080/akachan-0.1/ws/";
    private urlAka:string =  "https://mw.akachan.fr/akachan-0.1/ws/";

    private headers = new Headers ({'content-type': 'application/json'});
    private token:string;

    constructor(private http: Http) { 
        this.token = localStorage.getItem('token');
        this.headers.append('Authorization', `Bearer ${this.token}`);
    }

    /**
     * rechercher un prénom : obtenir une map de prénoms et booleen si estimation existante pour ce client.
     * 
     * @param estimation : passer un objet estimation pour ses variables prenom, sexe, uuid client.
     * @param  rechercheExacte : SQL LIKE si false, recherche exacte si true)
     * @return une map<String le prénom, Booleen si estimation existante)
     */
     public rechercherPrenomEtEstimExistante(estimation:Estimation, rechercheExacte:boolean){
           const url = `${this.urlAka + "prenom/recherche" }/${rechercheExacte}`;
           let options = new RequestOptions({ headers: this.headers });
            
           return this.http.post(url,estimation,options)
              .map((response:Response) => {
                if(response.status != 200) {
                  return response.status }
                else{
                return response.json();
                }
              }
              );
     }
    
   
  /**
   * obtenir un prénom aléatoire
   * 
   * @param choixSexe 
   * @param refClient 
   * @param choixTendance 
   * @return String un prénom aléatoire
   */
  public getPrenomAleatoire(choixSexe:String, refClient:String, choixTendance:Number): Observable<String> {
        
        const url = `${this.urlAka + "prenom" }/${choixSexe}/${refClient}/${choixTendance}`;
        let options = new RequestOptions({ headers: this.headers });
        
        return this.http.get(url,options)
                        .map((response:Response) => {
                            if(response.status == 204) {
                              return response.status.toString() }
                            else{
                            return response.text();
                            }
                        });
  }  

  /**
   * obtenir un tableau de naissances entre 1900 et 2015
   * 
   * @param prenom le prénom pour lequel obtenir les stats de naissances
   * @param sexe le sexe du prénom
   * @return un tableau Number[] de naissances de 1900 (=index 0) à 2015
   */
  public getNaissances(prenom: String, sexe: String): Observable<Number[]>{
          const url = `${this.urlAka + "insee/pop" }/${sexe}/${prenom}`;
          let options = new RequestOptions({ headers: this.headers });

          return this.http.get(url,options)
              .map((response:Response) => response.json());
     }

}
