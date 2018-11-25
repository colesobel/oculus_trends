import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-db-connection',
  templateUrl: './new-db-connection.component.html',
  styleUrls: ['./new-db-connection.component.css']
})
export class NewDbConnectionComponent implements OnInit {

  portHint: number = 3306

  constructor(private sharedService: SharedService, private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  onServerChange(serverRef) {
    switch (serverRef.value) {
      case 'mysql': 
        this.portHint = 3306
        break
      case 'postgres':
        this.portHint = 5432
        break
      case 'redshift': 
        this.portHint = 5439
        break
    }
  }

  onConnectionSubmit(form: NgForm) {
    
    if (!form.value['port']) {
      form.value['port'] = this.portHint
    }
    this.sharedService.submitDatabaseConnection(form.value).subscribe(
      response => {
        let dbConn = response.body['record']
        this.authService.addToDbcs(dbConn)
        this.router.navigate(['app', 'account'])
      }, 
      error => {
        console.log('There was an error')
        console.log(error)
      }
    )
  }

}
