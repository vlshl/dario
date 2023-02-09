export class TradePosition {
    posID: number;
    insID: number;
    count: number;
    openTime: Date;
    openPrice: number;
    closeTime: Date | null;
    closePrice: number | null;
    posType: number;
    accountID: number;
    tradeIDs: number[];

    constructor() {
        this.posID = 0;
        this.insID = 0;
        this.count = 0;
        this.openTime = new Date();
        this.openPrice = 0;
        this.closeTime = null;
        this.closePrice = null;
        this.posType = 0;
        this.accountID = 0;
        this.tradeIDs = [];
    }
}
