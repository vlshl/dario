import { InteractivityChecker } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PxColumn, PxPluginInfo } from '../common/px-plugin';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class PluginService {

  constructor(private http: HttpClient, private config: ConfigService) { }

  getList(): Observable<PxPluginInfo[]> {
    return this.http.get<PxPluginInfo[]>(this.config.getApiUrl(`plugin/list`));
  }

  load(plugin: string): Observable<boolean> {
    return this.http.post<boolean>(this.config.getApiUrl(`plugin/${plugin}/load`), null);
  }

  unload(plugin: string): Observable<boolean> {
    return this.http.post<boolean>(this.config.getApiUrl(`plugin/${plugin}/unload`), null);
  }

  loadAll(): Observable<any> {
    return this.http.post(this.config.getApiUrl('plugin/load-all'), null);
  }

  unloadAll(): Observable<any> {
    return this.http.post(this.config.getApiUrl('plugin/unload-all'), null);
  }

  getColumns(plugin: string): Observable<PxColumn[]> {
    return this.http.get<PxColumn[]>(this.config.getApiUrl(`plugin/${plugin}/cols`));
  }  

  getData(plugin: string): Observable<Object[]> {
    return this.http.get<Object[]>(this.config.getApiUrl(`plugin/${plugin}/data`));
  }  
}
