import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Instrum } from '../common/instrum';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class InstrumService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  private instrumList: Instrum[] = [];

  initialize() {
    this.http.get<Instrum[]>(this.config.getApiUrl('instrum/list')).subscribe(res => {
      this.instrumList = res;
    });
  }

  getInstrumList(): Instrum[] {
    return this.instrumList;
  }

  getInstrumById(insId: number): Instrum | undefined{
    return this.instrumList.find(r => r.insID === insId);
  }

  getInstrumByTicker(ticker: string): Instrum | undefined{
    return this.instrumList.find(r => r.ticker === ticker);
  }
}
