import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-db-connection',
  templateUrl: './new-db-connection.component.html',
  styleUrls: ['./new-db-connection.component.css']
})
export class NewDbConnectionComponent implements OnInit {

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
  }

  onConnectionSubmit(form: NgForm) {
    this.sharedService.submitDatabaseConnection(form.value).subscribe(
      response => {
        console.log(response)
        console.log('Woohoo!')
        this.router.navigate(['app', 'account'])
      }, 
      error => {
        console.log('There was an error')
        console.log(error)
      }
    )
  }

}
