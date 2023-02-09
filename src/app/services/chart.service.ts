import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { map, zipAll } from 'rxjs/operators';
import { Bar } from '../drawing/bar';
import { BarRow } from '../drawing/bar-row';
import { ChartBrush } from '../drawing/chart-brush';
import { ChartData } from '../drawing/chart-data';
import { PriceChart } from '../drawing/price-chart';
import { Timeframes } from '../drawing/timeframes';
import { Timeline } from '../drawing/timeline';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor(private http: HttpClient, private config: ConfigService) { }

  private loadTimeline(timeline: Timeline, accountId: number, insId: number): Observable<number> {
    const url = this.config.getApiUrl(`chart/${accountId}/${insId}/${timeline.timeframe}/timeline/${timeline.count}`);
    return this.http.get<IRemoteTimeline>(url).pipe(map(res => {
      return this.loadTimelineFromData(timeline,
        { startTime:  new Date(res.startTime), timeframe: res.timeframe, increments: res.increments });
    }));
  }

  private loadTimelineFromData(timeline: Timeline, data: IRemoteTimeline): number {
    const oldCount = timeline.count;
    timeline.add(data.startTime, data.timeframe);

    let cur = data.startTime;

    for (let i = 0; i < data.increments.length / 2; i++) {
      const inc = data.increments[i * 2];
      const count = data.increments[i * 2 + 1];

      for (let c = 0; c < count; c++) {
        cur = this.dateAdd(cur, inc, data.timeframe);
        timeline.add(cur, data.timeframe);
      }
    }

    return timeline.count - oldCount;
  }

  private dateAdd(d: Date, inc: number, tf: Timeframes): Date {
    if (tf === Timeframes.Min) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + inc, d.getSeconds());
    } else if (tf === Timeframes.Min5) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 5 * inc, d.getSeconds());
    } else if (tf === Timeframes.Min10) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 10 * inc, d.getSeconds());
    } else if (tf === Timeframes.Min15) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 15 * inc, d.getSeconds());
    } else if (tf === Timeframes.Min20) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 20 * inc, d.getSeconds());
    } else if (tf === Timeframes.Min30) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 30 * inc, d.getSeconds());
    } else if (tf === Timeframes.Hour) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours() + inc, d.getMinutes(), d.getSeconds());
    } else if (tf === Timeframes.Day) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + inc, d.getHours(), d.getMinutes(), d.getSeconds());
    } else if (tf === Timeframes.Week) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * inc, d.getHours(), d.getMinutes(), d.getSeconds());
    } else {
      return d;
    }
  }

  private loadPriceChart(priceChart: PriceChart, accountId: number, insId: number, key: number): Observable<number> {
    const from = priceChart.barRow.count();
    const tf = priceChart.barRow.timeline.timeframe;
    const url = this.config.getApiUrl(`chart/${accountId}/${insId}/${tf}/pricechart/${key}/${from}`);
    return this.http.get<IRemotePriceChart>(url).pipe(map(res => {
      return this.loadPriceChartData(priceChart, res);
    }));
  }

  private loadPriceChartData(priceChart: PriceChart, data: IRemotePriceChart): number {
    let k = 1;
    if (data.decimals === 1) { k = 10; }
    else if (data.decimals === 2) { k = 100; }
    else if (data.decimals === 3) { k = 1000; }
    else if (data.decimals === 4) { k = 10000; }
    else if (data.decimals === 5) { k = 100000; }
    else if (data.decimals === 6) { k = 1000000; }
    else if (data.decimals === 7) { k = 10000000; }
    else if (data.decimals === 8) { k = 100000000; }
    else if (data.decimals === 9) { k = 1000000000; }
    else if (data.decimals === 10) { k = 1000000000; }

    const oldCount = priceChart.barRow.count();
    let price = data.startPrice;
    const count = data.diffs.length / 5;
    for (let i = 0; i < count; i++) {
      const idx = i * 5;
      const open = price + data.diffs[idx]; price = open;
      const high = price + data.diffs[idx + 1]; price = high;
      const low = price + data.diffs[idx + 2]; price = low;
      const close = price + data.diffs[idx + 3]; price = close;
      const volume = data.diffs[idx + 4];
      const bar = new Bar(open / k, close / k, high / k, low / k, volume);
      priceChart.barRow.addBar(bar);
    }
    priceChart.setBrush(data.brush);

    return priceChart.barRow.count() - oldCount;
  }

  getChartData(timeline: Timeline, accountId: number, insId: number): Observable<ChartData> {
    const url = this.config.getApiUrl(`chart/${accountId}/${insId}/${timeline.timeframe}/chartdata`);

    return this.http.get<IRemoteChartData>(url).pipe(map(rcd => {
      const chartData = new ChartData(timeline, rcd.digits, rcd.isDynamic);
      rcd.visuals.forEach(v => {
        if (v.type === 'PriceChart') {
          const bars = new BarRow(timeline);
          const priceChart = new PriceChart(v.key, bars);
          if (v.side === 'left') {
            chartData.leftVisuals.push(priceChart);
          } else if (v.side === 'right') {
            chartData.rightVisuals.push(priceChart);
          }
        }
      });

      return chartData;
    }));
  }

  loadAllData(chartData: ChartData, accountId: number, insId: number): Observable<number> {
    const obs: Observable<number>[] = [];
    obs.push(this.loadTimeline(chartData.timeline, accountId, insId));
    const visuals =  [...chartData.leftVisuals, ...chartData.rightVisuals];
    visuals.forEach(v => {
      if (v instanceof PriceChart) {
        obs.push(this.loadPriceChart(v as PriceChart, accountId, insId, v.key));
      }
    });

    return zip(...obs).pipe(map(ns => ns[0]));
  }
}

interface IRemoteTimeline {
  startTime: Date;
  timeframe: Timeframes;
  increments: number[];
}

interface IRemotePriceChart {
  brush: ChartBrush;
  startPrice: number;
  decimals: number;
  diffs: number[];
}

interface IRemoteVisual {
  key: number;
  side: string;
  type: string;
}

interface IRemoteChartData {
  isDynamic: boolean;
  digits: number;
  visuals: IRemoteVisual[];
}
