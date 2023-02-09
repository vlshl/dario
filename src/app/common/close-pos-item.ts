import { InstrumService } from '../services/instrum.service';
import { TradePosition } from './trade-position';

export class ClosePosItem {
    constructor(private insSvc: InstrumService, private pos: TradePosition) {
      this.posId = pos.posID;
      this.insId = pos.insID;
      this.count = pos.count;
      this.posTypeStr = pos.posType === 0 ? 'Long' : 'Short';
      this.openTime = pos.openTime;
      this.openPrice = pos.openPrice;
      this.openSumma = this.openPrice * this.count;
      this.closeTime = pos.closeTime;
      this.closePrice = pos.closePrice;
      this.closeSumma = this.closePrice  !== null ? this.closePrice * this.count : null;
      this.profit = this.closeSumma !== null ? this.closeSumma - this.openSumma : null;
      this.profitPerc = this.profit != null ? this.profit / this.openSumma * 100 : null;

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
    posTypeStr: string;
    openTime: Date;
    openPrice: number;
    openSumma: number;
    closeTime: Date | null;
    closePrice: number | null;
    closeSumma: number | null;
    profit: number | null;
    profitPerc: number | null;
  }
