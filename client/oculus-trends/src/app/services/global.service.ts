import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  apiUrl: string = 'http://localhost:5000/'
  tokenKey: string = 'ot_token'

  constructor(private cookieService: CookieService) { }

}
