import { Timeline } from './timeline';
import { IVisual } from './interfaces';

export class ChartData {
    public leftVisuals: IVisual[];
    public rightVisuals: IVisual[];

    constructor(public timeline: Timeline, public digits: number, public isDynamic: boolean) {
        this.leftVisuals = [];
        this.rightVisuals = [];
    }
}
