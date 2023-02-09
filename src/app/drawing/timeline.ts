import { getDates } from './tf-helper';
import { Timeframes } from './timeframes';

export class Timeline {
    private dates: BarDate[];
    private tf: Timeframes;

    constructor(tf: Timeframes) {
        this.tf = tf;
        this.dates = [];
    }

    get timeframe(): Timeframes {
        return this.tf;
    }

    start(index: number): Date | null {
        if (index < 0 || index >= this.dates.length) { return null; }
        return this.dates[index].start;
    }

    nextStart(index: number): Date | null {
        if (index < 0 || index >= this.dates.length) { return null; }
        return this.dates[index].nextStart;
    }

    getBarDate(index: number): BarDate | null {
        if (index < 0 || index >= this.dates.length) { return null; }
        return this.dates[index];
    }

    get count(): number {
        return this.dates.length;
    }

    isExists(index: number) {
        return index >= 0 && index < this.dates.length;
    }

    findIndex(time: Date): number {
        return this.dates.findIndex(d => d.start <= time && time < d.nextStart);
    }

    clear() {
        this.dates = [];
    }

    add(date: Date, tf: Timeframes) {
        const dts = getDates(date, tf);
        this.dates.push(new BarDate(dts[0], dts[1]));
    }

}

export class BarDate {
    public start: Date;
    public nextStart: Date;

    constructor(start: Date, nextStart: Date) {
        this.start = start;
        this.nextStart = nextStart;
    }
}
