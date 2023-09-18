export class OpenPosItem {
  posId: number;
  insId: number;
  ticker: string;
  shortName: string;
  name: string;
  count: number;
  lots: number;
  openTime: Date;
  openPrice: number;
  openSumma: number;
  posType: number;
  curPrice: number;
  curSumma: number;
  profit: number;
  profitPerc: number;

  constructor() {
      this.posId = 0;
      this.insId = 0;
      this.ticker = '';
      this.shortName = '';
      this.name = '';
      this.lots = 0;
      this.count = 0;
      this.openTime = new Date();
      this.openPrice = 0;
      this.openSumma = 0;
      this.posType = 0;
      this.curPrice = 0;
      this.curSumma = 0;
      this.profit = 0;
      this.profitPerc = 0;
    }
  }
