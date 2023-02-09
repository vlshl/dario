export class LastPrice {
    ticker: string;
    date: number;
    time: number;
    price: number;
    lots: number;

    constructor() {
        this.ticker = '';
        this.date = 0;
        this.time = 0;
        this.price = 0;
        this.lots = 0;
    }
}
