import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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

  public ticker = '';
  public timeframe = 1;
  private chart: Chart;
  private isMouseDown = false;

  constructor(@Inject(DOCUMENT) private document: Document, private chartSvc: ChartService, private instrumSvc: InstrumService) {
    this.chart = new Chart();
  }

  ngOnInit(): void {
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
    const instrum = this.instrumSvc.getInstrumByTicker(this.ticker);
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
