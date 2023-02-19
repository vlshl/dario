import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Instrum } from '../common/instrum';
import { ConfigService } from './config.service';
import { InstrumListItem } from '../common/instrum-list-item';

@Injectable({
  providedIn: 'root'
})
export class InstrumService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  private instrumList: Instrum[] = [];
  private favInstrumIds: number[] = [];
  private activeInstrumIds: number[] = [];

  initialize() {
    this.http.get<Instrum[]>(this.config.getApiUrl('instrum/list')).subscribe(res => {
      this.instrumList = res;
    });

    this.http.get<number[]>(this.config.getApiUrl('instrum/favs')).subscribe(res => {
      this.favInstrumIds = res;
    });

    this.http.get<number[]>(this.config.getApiUrl('instrum/actives')).subscribe(res => {
      this.activeInstrumIds = res;
    });
  }

  getInstrumList(isFav: boolean, isActive: boolean): Instrum[] {
    let list = this.instrumList;

    if (isFav) {
      list = list.filter(r => this.favInstrumIds.includes(r.insID));
    }
    
    if (isActive) {
      list = list.filter(r => this.activeInstrumIds.includes(r.insID));
    }

    return list;
  }

  isFavInstrum(insId: number) {
    return this.favInstrumIds.includes(insId);
  }

  isActiveInstrum(insId: number) {
    return this.activeInstrumIds.includes(insId);
  }

  addFavInstrum(insId: number) {
    if (this.favInstrumIds.includes(insId)) return;

    this.http.post<number[]>(this.config.getApiUrl('instrum/addfav/' + insId.toString()), null).subscribe(res => {
      this.favInstrumIds = res;
    });
  }

  removeFavInstrum(insId: number) {
    const idx = this.favInstrumIds.indexOf(insId);
    if (idx < 0) return;

    this.http.post<number[]>(this.config.getApiUrl('instrum/remfav/' + insId.toString()), null).subscribe(res => {
      this.favInstrumIds = res;
    });
  }

  getInstrumById(insId: number): Instrum | undefined{
    return this.instrumList.find(r => r.insID === insId);
  }

  getInstrumByTicker(ticker: string): Instrum | undefined{
    return this.instrumList.find(r => r.ticker === ticker);
  }
}
