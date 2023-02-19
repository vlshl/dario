import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Instrum } from 'src/app/common/instrum';
import { Chart } from 'src/app/drawing/chart';
import { Graphics } from 'src/app/drawing/graphics';
import { Timeline } from 'src/app/drawing/timeline';
import { ChartService } from 'src/app/services/chart.service';
import { InstrumService } from 'src/app/services/instrum.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  public instrum: Instrum | null = null;
  public timeframe: number = 8;
  public instrums: Instrum[] = [];

  private chart: Chart;
  private isMouseDown = false;

  constructor(@Inject(DOCUMENT) private document: Document, private chartSvc: ChartService, private instrumSvc: InstrumService) {
    this.chart = new Chart();
  }

  ngOnInit(): void {
    this.instrums = this.instrumSvc.getInstrumList(true, false);

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const canvasbox = document.getElementById('canvasbox') as HTMLDivElement;
    canvas.width = canvasbox.clientWidth; 
    canvas.height = canvasbox.clientHeight - 10;
    const g = new Graphics(canvas.getContext('2d')!);
    g.reset(canvas.width, canvas.height);

    this.chart.onRefresh = () => {
      this.chart.draw(g);
    };

    canvas.addEventListener('mouseup', e => {
      this.isMouseDown = false;
    });
    canvas.addEventListener('mousedown', e => {
      this.isMouseDown = true;
      this.chart.beginMoving(e.x);
    });
    canvas.addEventListener('mousemove', e => {
      if (!this.isMouseDown) { return; }
      this.chart.moving(e.x);
    });
  }

  showChart() {
    if (this.instrum === null) return;

    const instrum = this.instrumSvc.getInstrumByTicker(this.instrum.ticker);
    if (instrum == null) { return; }

    const insId = instrum.insID;
    const accountId = 1;

    const timeline = new Timeline(this.timeframe);
    this.chartSvc.getChartData(timeline, accountId, insId).subscribe(chartData => {
      this.chartSvc.loadAllData(chartData, accountId, insId).subscribe(n => {
        this.chart.chartData = chartData;
      });
    });
  }
}
