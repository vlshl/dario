import { Component, OnInit, OnDestroy } from '@angular/core';
import { PositionService } from 'src/app/services/position.service';
import { InstrumService } from 'src/app/services/instrum.service';
import { OpenPosItem } from 'src/app/common/open-pos-item';
import { LeechService } from 'src/app/services/leech.service';

@Component({
  selector: 'app-open-pos-list',
  templateUrl: './open-pos-list.component.html',
  styleUrls: ['./open-pos-list.component.scss']
})
export class OpenPosListComponent implements OnInit, OnDestroy {

  items: OpenPosItem[] = [];
  intervalId: any;

  constructor(private posSvc: PositionService, private insSvc: InstrumService, private leechSvc: LeechService) { }

  ngOnInit(): void {
    this.refreshPrices(this);
    this.intervalId = setInterval(this.refreshPrices, 10000, this);
}

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  refreshPrices(ctx: any) {
    const svc = ctx.posSvc as PositionService;
    svc.getOpenPos().subscribe({
      next: (res) => {
        ctx.items = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getPosTypeStr(posType: number) {
    return posType == 0 ? "Long" : "Short";
  }
}
