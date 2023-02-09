import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { TradePosition } from '../common/trade-position';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getOpenPos(): Observable<TradePosition[]> {
    return this.http.get<TradePosition[]>(this.config.getApiUrl('positions/open'));
  }

  getClosePos(): Observable<TradePosition[]> {
    return this.http.get<TradePosition[]>(this.config.getApiUrl('positions/close'));
  }

  clearPos(): Observable<string> {
    return this.http.post<string>(this.config.getApiUrl('positions/clear'), null);
  }

  refreshPos(): Observable<string> {
    return this.http.post<string>(this.config.getApiUrl('positions/refresh'), null);
  }
}
