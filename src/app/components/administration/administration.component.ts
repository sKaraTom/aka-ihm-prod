import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from "../../services/authentification.service";

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  constructor(private authService:AuthentificationService) { }

  ngOnInit() {
  }

  private deconnecter(): void {

    this.authService.deconnecterAdmin();

  }


}
