import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, of } from 'rxjs';
import { LastPrice } from '../common/last-price';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class LeechService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getIdentity(): Observable<string> {
    return this.http.get<string>(this.config.getApiUrl('leech/ident'), httpOptions);
  }

  fullsync(): Observable<string> {
    return this.http.post<string>(this.config.getApiUrl('leech/fullsync'), null);
  }

  sync(): Observable<string> {
    return this.http.post<string>(this.config.getApiUrl('leech/sync'), null);
  }

  getLastPrices(tickers: string): Observable<LastPrice[]> {
    return this.http.get<LastPrice[]>(this.config.getApiUrl('leech/lastprice/' + tickers));
  }
}
