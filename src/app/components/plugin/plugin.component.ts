import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { PxColumn } from 'src/app/common/px-plugin';
import { PluginService } from 'src/app/services/plugin.service';

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit, OnDestroy {

  list: Object[] = [];
  cols: PxColumn[] = [];

  private intervalId: any;
  private pluginKey: string = "";
  
  constructor(private pluginSvc: PluginService, private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(r => {
      this.pluginKey = r["plugin"];
    });
  }

  ngOnInit(): void {
    this.pluginSvc.getColumns(this.pluginKey).subscribe(r => {
      this.cols = r;
    });
    this.refreshData(this);
    this.intervalId = setInterval(this.refreshData, 10000, this);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  refreshData(ctx: PluginComponent) {
    ctx.pluginSvc.getData(ctx.pluginKey).subscribe(r => {
      ctx.list = r;
    });
  }

  getCell(r: any, c: PxColumn) {
    return r[c.key];
  }
}
