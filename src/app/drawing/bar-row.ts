import { Bar } from './bar';
import { Timeline } from './timeline';
import { ValueRow } from './value-row';

export class BarRow {
    private openVr: ValueRow;
    private closeVr: ValueRow;
    private highVr: ValueRow;
    private lowVr: ValueRow;
    private medianVr: ValueRow;
    private typicalVr: ValueRow;
    private values: number[];

    constructor(public timeline: Timeline) {
        this.openVr = new ValueRow();
        this.closeVr = new ValueRow();
        this.highVr = new ValueRow();
        this.lowVr = new ValueRow();
        this.medianVr = new ValueRow();
        this.typicalVr = new ValueRow();
        this.values = [];
    }

    addBar(bar: Bar) {
        this.openVr.add(bar.open);
        this.closeVr.add(bar.close);
        this.highVr.add(bar.high);
        this.lowVr.add(bar.low);
        this.medianVr.add((bar.high + bar.low) / 2);
        this.typicalVr.add((bar.high + bar.low + bar.close) / 3);
        this.values.push(bar.volume);
    }

    getBar(i: number) {
        if (i < 0 || i >= this.values.length) { return null; }
        return new Bar(this.openVr.getValue(i)!, this.closeVr.getValue(i)!, this.highVr.getValue(i)!, this.lowVr.getValue(i)!, this.values[i]);
    }

    count(): number {
        return this.values.length;
    }
}
