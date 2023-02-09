export class Instrum {
    insID: number;
    ticker: string;
    shortName: string;
    name: string;
    lotSize: number;
    decimals: number;
    priceStep: number;

    constructor() {
        this.insID = 0;
        this.ticker = '';
        this.shortName = '';
        this.name = '';
        this.lotSize = 0;
        this.decimals = 0;
        this.priceStep = 0;
    }
}
