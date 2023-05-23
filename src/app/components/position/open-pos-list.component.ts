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
    this.posSvc.getOpenPos().subscribe({
      next: (res) => {
        this.items = res.map(p => new OpenPosItem(this.insSvc, p));
        this.items.sort((a, b) => new Date(a.openTime).getTime() - new Date(b.openTime).getTime());
        this.refreshPrices(this.leechSvc, this.items);
        this.intervalId = setInterval(this.refreshPrices, 10000, this.leechSvc, this.items);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  refreshPrices(leechSvc: LeechService, items: OpenPosItem[]) {
    const tickers = items.map(r => r.ticker).join(',');
    leechSvc.getLastPrices(tickers).subscribe({
      next: (prices) => {
        if (prices !== null) {
          for (let i = 0; i < items.length; i++) {
            const found = prices.find(p => p.ticker === items[i].ticker);
            if (found) {
              items[i].setCurrentPrice(found.price);
            }
          }
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
