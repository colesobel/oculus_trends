import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'
import { AuthService } from '../../services/auth.service';
import { DatabaseConnectionInterface, AccountOverviewInterface } from '../../models/account-overview.model'
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-account-default',
  templateUrl: './account-default.component.html',
  styleUrls: ['./account-default.component.css']
})
export class AccountDefaultComponent implements OnInit, OnDestroy {
  dbcs: DatabaseConnectionInterface[]
  accountOverviewSubscription: Subscription
  users: User
  constructor(private authService: AuthService, private http: HttpClient, private globalService: GlobalService) { }

  ngOnInit() {
    this.getUsers()
    this.dbcs = this.authService.accountOverview.dbcs
    this.accountOverviewSubscription = this.authService.accountOverviewChanged.subscribe((overview: AccountOverviewInterface) => {
      console.log('got a new value from account overview')
      this.dbcs = overview.dbcs
    })
  }

  getUsers() {
    this.authService.getUsersForAccount().then(response => {
      console.log(response)
      this.users = response['results']
    }, 
    error => {
      console.log('error getting users')
      console.log(error)
    })
  }

  onEditDbConnection(id) {
    console.log(`editing id ${id}`)
  }

  onDeleteDbConnection(name, id) {
    if (confirm(`Are you sure you want to delete connection: ${name}?`)) {
      console.log(`deleting id ${id}`)
      this.http.delete(this.globalService.apiUrl + `db_conn/${id}`).subscribe(response => {
        this.dbcs = this.dbcs.filter(elem => {
          return elem.id != id
        })
        this.authService.updateDbcs(this.dbcs)
      }, 
      error => {
        console.log('There was an error')
        // TODO add error alerting here
      })

    }
  }

  onDeleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user: ${user.firstName} ${user.lastName}?`)) {
      console.log(`Deleting ${user.id}`)
    }
  }

  ngOnDestroy() {
    console.log('removing subscription')
    this.accountOverviewSubscription.unsubscribe()
  }

}
