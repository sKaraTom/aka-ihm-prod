import { Injectable } from '@angular/core';

import { Headers,Http, Response, RequestOptions,URLSearchParams } from "@angular/http";

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/Rx';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch'
import { Compte } from "../objetmetier/compte";
import { Router } from "@angular/router";

@Injectable()
export class AuthentificationService {
  
  private urlAka:String = "http://akachan.jelastic.dogado.eu/akachan-0.1/ws/";
 
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers2 = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

  private token: string;

  private idClient: string;
  // observable string sources
  public idClientSource : BehaviorSubject<string> = new BehaviorSubject<string>('');
  // observable string flux
  public idClientObs : Observable<string> = this.idClientSource.asObservable();

  private prenomClient: string;
  public prenomClientSource : BehaviorSubject<string> = new BehaviorSubject<string>('');
  public prenomClientObs : Observable<string> = this.prenomClientSource.asObservable();


  // url de redirection après connexion.
  redirectUrl: string;

  constructor(private http:Http, private router: Router) {
    
    this.token = localStorage.getItem('token');
    this.prenomClient = localStorage.getItem('prenom');
    this.prenomClientSource.next(localStorage.getItem('prenom'));
    this.idClient = localStorage.getItem('id');
    this.idClientSource.next(localStorage.getItem('id'));
    this.headers.append('authorization', `Bearer ${this.token}`);
 
  }

    //  public creerCompte(compte:Compte) {
    //     const url = `${this.urlAka +"compte/creer"}`;
    //     return this.http.post(url, compte, this.headers)
    //     .map((data:Response) =>data.json())
    // }


      public connecter(email:string, password:string): Observable<boolean> {

          const url = `${this.urlAka +"compte"}`;

          // pour passer les credentiels en FormParam
          let body = `email=${email}&password=${password}`;

       return this.http.post(url, body, { headers: this.headers2 })
            .map((data: Response) => {
              let token = data.json() && data.json().token;
              
              if (token) {
                this.headers2 = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': data.json().token});
                this.token = data.json().token;
                
                this.prenomClient = data.json().prenom;
                this.prenomClientSource.next(data.json().prenom);
                
                this.idClient = data.json().id;
                this.idClientSource.next(data.json().id);

                localStorage.setItem('token', this.token);
                localStorage.setItem('prenom', this.prenomClient);
                localStorage.setItem('id', this.idClient);
                    // return true pour indiquer que la connexion est un succes.
                    return true;
                } else {
                    // return false pour indiquer l'échec à la connexion.
                    return false;
                }
            });

      }

      public deconnecter(): void {

        this.token = null;
        this.idClient = null;
        this.idClientSource.next(null);
        this.prenomClient = null;
        this.prenomClientSource.next(null);
        localStorage.clear();
    }
    
    // OBSERVABLE. Si inutilisé à supprimer.
    public validerToken(): Observable<string> {

         const url = `${this.urlAka +"compte/token"}`;

         // passer le token du local storage en Header pour validation côté mw.
         let headersValid = new Headers({'Content-Type': 'application/json'});
         headersValid.append('authorization', `Bearer ${localStorage.getItem('token')}`);

          let options = new RequestOptions({ headers: headersValid });

            return this.http.get(url,options)
            .map((response:Response) => response.toString());
        
    }

    // PROMISE. INUTILISE POUR L'INSTANT
    public validerTokenPromise(): Promise<string> {
        const url = `${this.urlAka +"compte/token"}`;

        // passer le token du local storage en Header pour validation côté mw.
        let headersValid = new Headers({'Content-Type': 'application/json'});
        headersValid.append('authorization', `Bearer ${localStorage.getItem('token')}`);

        let options = new RequestOptions({ headers: headersValid });

       return this.http.get(url,options)
                .toPromise()
                .then(reponse => reponse.text());
    }

    public estConnecte() {
        
         const url = `${this.urlAka +"compte/token"}`;

         // passer le token du local storage en Header pour validation côté mw.
         let headersValid = new Headers({'Content-Type': 'application/json'});
         headersValid.append('authorization', `Bearer ${localStorage.getItem('token')}`);

          let options = new RequestOptions({ headers: headersValid });
        
        // si le token est valide : retourner true, si catch d'erreur (=> exception unauthorized) retourner false
        return this.http.get(url,options)
            .map((response:Response) => 
                 {      if(response) {
                        return true;
                    } 
                    else { }
                })
            .catch((error) => { 
                this.deconnecter();
                this.router.navigateByUrl('/login');
                return Observable.of(false); })
        
    }


}
