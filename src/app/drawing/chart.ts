import { ChartBrush } from './chart-brush';
import { IGraphics } from './igraphics';
import { Timeline } from './timeline';
import { AxisY } from './axis-y';
import { AxisX } from './axis-x';
import { ChartData } from './chart-data';
import { LastValue } from './interfaces';

export class Chart {

    public movingSpeed: number;
    public onRefresh: (() => void) | null = null;

    private digits: number = 0;
    private axisX: AxisX | null = null;
    private leftAxisY: AxisY | null = null;
    private rightAxisY: AxisY | null = null;
    private axisXHeight: number;
    private leftAxisYWidth: number;
    private rightAxisYWidth: number;
    private bgBrush: ChartBrush;
    private data: ChartData | null = null;
    private startMovingX: number;

    constructor() {
        this.axisXHeight = 30;
        this.leftAxisYWidth = 50;
        this.rightAxisYWidth = 50;
        this.bgBrush = new ChartBrush(0xf0, 0xf0, 0xf0);
        this.startMovingX = 0;
        this.movingSpeed = 1;
    }

    public get chartData(): ChartData | null {
        return this.data;
    }

    public set chartData(cd: ChartData | null) {
        if (cd == null) { return; }

        this.data = cd;
        const timeline = cd.timeline;
        this.digits = cd.digits;

        if (this.axisX) {
            this.createAxis(timeline, this.axisX.barWidthPx, this.axisX.betweenBarsPx);
        } else {
            this.createAxis(timeline);
        }
        if (this.onRefresh) this.onRefresh();
    }

    public beginMoving(x: number) {
        if (!this.axisX) { return; }

        this.startMovingX = x;
        this.axisX.beginMoving();
    }

    public moving(x: number) {
        if (!this.axisX) { return; }

        this.axisX.moving(this.movingSpeed * (x - this.startMovingX));
        if (this.onRefresh) this.onRefresh();
    }

    public zoomIn() {
        if (!this.axisX) { return; }

        // this.axisX.zoomIn();
        if (this.onRefresh) this.onRefresh();
    }

    public zoomOut() {
        if (!this.axisX) { return; }

        // this.axisX.zoomOut();
        if (this.onRefresh) this.onRefresh();
    }

    public draw(g: IGraphics): void {
        if (!this.data || !this.chartData || !this.axisX) { return; }

        g.clear(this.bgBrush.red, this.bgBrush.green, this.bgBrush.blue, this.bgBrush.alpha);
        this.axisX.draw(g, this.chartData.isDynamic);

        if (this.leftAxisY != null) {
            let min: number | null = null;
            let max: number | null = null;
            
            for (const v of this.data.leftVisuals) {
                const minmax = v.getMinMax(this.axisX);
                if (minmax == null) continue;

                if (minmax[0] != null && (min == null || minmax[0] < min)) { min = minmax[0]; }
                if (minmax[1] != null && (max == null || minmax[1] > max)) { max = minmax[1]; }
            }
            if (min == null) { min = 0; }
            if (max == null) { max = 100; }

            const lastValues: LastValue[] = [];
            for (const v of this.data.leftVisuals) {
                const lvl = v.getLastValue(this.axisX);
                const br = v.getBrush();
                if (lvl != null && br != null)  {
                    lastValues.push({ value: lvl, brush: br } as LastValue);
                }
            }
            this.leftAxisY.draw(g, min, max, lastValues);
        }

        if (this.rightAxisY != null) {
            let min: number | null = null;
            let max: number | null = null;
            for (const v of this.data.rightVisuals) {
                const minmax = v.getMinMax(this.axisX);
                if (minmax == null) continue;

                if (minmax[0] != null && (min == null || minmax[0] < min)) { min = minmax[0]; }
                if (minmax[1] != null && (max == null || minmax[1] > max)) { max = minmax[1]; }
            }
            if (min == null) { min = 0; }
            if (max == null) { max = 100; }

            const lastValues: LastValue[] = [];
            for (const v of this.data.rightVisuals) {
                const lv = v.getLastValue(this.axisX);
                const b = v.getBrush();
                if (lv != null && b != null)  {
                    lastValues.push({ value: lv, brush: b } as LastValue);
                }
            }
            this.rightAxisY.draw(g, min, max, lastValues);
        }

        if (this.leftAxisY !== null) {
            for (const v of this.data.leftVisuals) {
                v.draw(g, this.axisX, this.leftAxisY);
            }
        }
        if (this.rightAxisY !== null) {
            for (const v of this.data.rightVisuals) {
                v.draw(g, this.axisX, this.rightAxisY);
            }
        }
    }

    private createAxis(dates: Timeline, barWidthInPixels: number = 5, pixelsBetweenBars: number = 1): void {
        const axisYWidth = 50;
        const isLeftVisualsExist = this.data!.leftVisuals.length > 0;
        const isRightVisualsExist = this.data!.rightVisuals.length > 0;
        this.axisXHeight = 30;
        this.leftAxisYWidth = isLeftVisualsExist ? axisYWidth : 0;
        this.rightAxisYWidth = isRightVisualsExist ? axisYWidth : 0;

        this.axisX = new AxisX(dates, this.axisXHeight, this.leftAxisYWidth, this.rightAxisYWidth, barWidthInPixels, pixelsBetweenBars);

        if (isLeftVisualsExist) {
            this.leftAxisY = new AxisY(this.axisXHeight, this.leftAxisYWidth, this.rightAxisYWidth, this.digits, true);
        } else {
            this.leftAxisY = null;
        }

        if (isRightVisualsExist) {
            this.rightAxisY = new AxisY(this.axisXHeight, this.leftAxisYWidth, this.rightAxisYWidth, this.digits, false);
        } else {
            this.rightAxisY = null;
        }
    }
}
