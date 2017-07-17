
import { Component, OnInit, Input, SimpleChange, ChangeDetectionStrategy, OnChanges, SimpleChanges } from "@angular/core";
import { PrenomService } from "../../services/prenom.service";
import { Params, ActivatedRoute } from "@angular/router";
import { PrenomInsee } from "../../objetmetier/prenominsee";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/switchMap';
import { Estimation } from "../../objetmetier/estimation";

// A REFACTORER OU SUPPRIMER


@Component({
  selector:'prenom-stats',
  template:  `
    <h2>STATS DU PRENOM</h2>
     <p-chart type="bar" [data]="data" [options]="options" width=1000px></p-chart>
       <p style="text-align: right;">Source : INSEE.</p>

    
  `,
  providers : [PrenomService]
})

export class PrenomStatsComponent implements OnInit, OnChanges{
   
    // @Input() private prenomSelectionne : String;
    @Input() public estimationSelectionnee:Estimation;
    @Input() public naissances:Number[] = [];

    //variables pour la Bar chart
    public data: any;
    public options: any;


    public annees:String[] = [];



   constructor(
    private router: ActivatedRoute,
    private prenomService: PrenomService) { this.getStats(); }
    


ngOnInit() {
}

  ngOnChanges(changes: SimpleChanges) {

    if ( changes.naissances && !changes.naissances.isFirstChange() ) {
    changes.naissances.currentValue = this.naissances;
    }
  }



public remplirXChart(): void {
    // boucle pour générer x années de la chart.
    for (var i = 1900; i <= 2015; i++) {
            this.annees.push(i.toString());
    }
}


public getStats() {
    
    this.data = {
            labels: this.annees,
            datasets: [
                {
                    label: 'Popularité du prénom',
                    backgroundColor: '#1e9ecc',
                    hoverBackgroundColor : '#eb505f',	
                    borderColor: '#1E88E5',
                    data: this.naissances
                },
            ]        
    }
    this.options = {
                    responsive: false,
                    title: {
                        display: true,
                        text: ' naissances  depuis 1900',
                        fontSize: 16 },
                    legend: {
                        display: false,
                        position: 'bottom', },
                   scales: {
                        xAxes: [{
                                    gridLines: { color: "rgba(0, 0, 0, 0.08)" },
                                    ticks: { autoSkip: true, maxTicksLimit: 12 }    }],
                         yAxes: [{
                                gridLines: { color: "rgba(0, 0, 0, 0.08)" },
                                ticks: { autoSkip: true, maxTicksLimit: 5 }     }]
                    }
     }; 

}












 }

