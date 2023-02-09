import { Component, OnInit } from '@angular/core';
import { PositionService } from 'src/app/services/position.service';
import { InstrumService } from 'src/app/services/instrum.service';
import { OpenPosItem } from 'src/app/common/open-pos-item';
import { LeechService } from 'src/app/services/leech.service';

@Component({
  selector: 'app-open-pos-list',
  templateUrl: './open-pos-list.component.html',
  styleUrls: ['./open-pos-list.component.scss']
})
export class OpenPosListComponent implements OnInit {

  items: OpenPosItem[] = [];
  timerId: any;

  constructor(private posSvc: PositionService, private insSvc: InstrumService, private leechSvc: LeechService) { }

  ngOnInit(): void {
    this.posSvc.getOpenPos().subscribe(res => {
      this.items = res.map(p => new OpenPosItem(this.insSvc, p));
      this.refreshPrices(this.leechSvc);
    }, err => {
      console.log(err);
    });
  }

  refreshPrices(leechSvc: LeechService) {
    const tickers = this.items.map(r => r.ticker).join(',');
    leechSvc.getLastPrices(tickers).subscribe(prices => {
      if (prices !== null) {
        for (let i = 0; i < this.items.length; i++) {
          const found = prices.find(p => p.ticker === this.items[i].ticker);
          if (found) {
            this.items[i].setCurrentPrice(found.price);
          }
        }
      }
      this.timerId = setTimeout(() => this.refreshPrices(leechSvc), 10000);
    }, err => {
        console.log(err);
    });
  }
}
