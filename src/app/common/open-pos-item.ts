import { InstrumService } from '../services/instrum.service';
import { TradePosition } from './trade-position';

export class OpenPosItem {
    constructor(private insSvc: InstrumService, private pos: TradePosition) {
      this.posId = pos.posID;
      this.insId = pos.insID;
      this.count = pos.count;
      this.openTime = pos.openTime;
      this.openPrice = pos.openPrice;
      this.posTypeStr = pos.posType === 0 ? 'Long' : 'Short';
      this.summa = this.openPrice * this.count;
      this.curPrice = 0;
      this.curSumma = 0;
      this.profit = 0;
      this.profitPerc = 0;

      const instrum = insSvc.getInstrumById(pos.insID);
      if (instrum) {
        this.ticker = instrum.ticker;
        this.shortName = instrum.shortName;
        this.lots = pos.count / instrum.lotSize;
      } else {
        this.ticker = '';
        this.shortName = '';
        this.lots = 0;
      }
    }

    posId: number;
    insId: number;
    ticker: string;
    shortName: string;
    lots: number;
    count: number;
    openTime: Date;
    openPrice: number;
    posTypeStr: string;
    summa: number;
    curPrice: number;
    curSumma: number;
    profit: number;
    profitPerc: number;

    setCurrentPrice(price: number) {
      this.curPrice = price;
      this.curSumma = this.curPrice * this.count;
      this.profit = this.curSumma - this.summa;
      this.profitPerc = this.profit / this.summa * 100;
    }
  }
