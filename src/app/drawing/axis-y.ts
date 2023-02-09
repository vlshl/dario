import { ChartBrush } from './chart-brush';
import { IGraphics } from './igraphics';
import { IAxisY, LastValue } from './interfaces';

export class AxisY implements IAxisY {
    private foreBrush: ChartBrush;
    private gridBrush: ChartBrush;
    private bgBrush: ChartBrush;
    private top: number = 0; // top boundary of axis area
    private bottom: number = 0; // bottom boundary of axis area
    private left: number = 0; // left boundary of axis area
    private right: number = 0; // right boundary of axis area
    private min: number = 0;
    private max: number = 0;

    constructor(private axisXHeight: number, private leftAxisYWidth: number,
                private rightAxisYWidth: number, private digits: number, private isLeftAxis = false) {

            this.foreBrush = new ChartBrush(0, 0, 0);
            this.gridBrush = new ChartBrush(200, 200, 200);
            this.bgBrush = new ChartBrush(0xf0, 0xf0, 0xf0);
    }

    public draw(g: IGraphics, minValue: number, maxValue: number, lastValues: LastValue[]) {
        g.setCurrentTextFormat('Arial', false, 11);
        this.min = minValue; this.max = maxValue; // BUG if min and max are equal
        this.top = 0;
        this.bottom = g.height - this.axisXHeight;
        if (this.isLeftAxis) {
            this.left = 0;
            this.right = this.leftAxisYWidth;
        } else {
            this.left = g.width - this.rightAxisYWidth;
            this.right = g.width;
        }

        g.setCurrentColor(this.bgBrush.red, this.bgBrush.green, this.bgBrush.blue, this.bgBrush.alpha);
        g.fillRectangle(this.left, this.top, this.right, this.bottom);

        const minMark = this.calcMinMark(this.min, this.max, this.bottom);
        const firstMark = this.toCeil(this.min, minMark);
        const lastMark = this.toFloor(this.max, minMark);

        let curMark = firstMark;
        do {
            const y = this.valueToY(curMark);
            if (y == null) { break; }

            // grid
            g.setCurrentColor(this.gridBrush.red, this.gridBrush.green, this.gridBrush.blue, this.gridBrush.alpha);
            g.drawLine(this.leftAxisYWidth, y, g.width - this.rightAxisYWidth, y, 1.0);

            g.setCurrentColor(this.foreBrush.red, this.foreBrush.green, this.foreBrush.blue, this.foreBrush.alpha);
            if (this.isLeftAxis) {
                g.drawLine(this.leftAxisYWidth, y, this.leftAxisYWidth - 5, y, 1.0);
                g.drawText(curMark.toFixed(this.digits), 0, y + 4);
            } else {
                g.drawLine(this.left, y, this.left + 5, y, 1.0);
                g.drawText(curMark.toFixed(this.digits), this.left + 5, y + 4);
            }
            curMark += minMark;
        } while (curMark <= lastMark);

        g.setCurrentColor(this.foreBrush.red, this.foreBrush.green, this.foreBrush.blue, this.foreBrush.alpha);
        if (this.isLeftAxis) {
            g.drawLine(this.right, this.bottom, this.right, this.top, 1.0);
        } else {
            g.drawLine(this.left, this.bottom, this.left, this.top, 1.0);
        }

        for (const lastValue of lastValues) {
            g.setCurrentColor(lastValue.brush.red, lastValue.brush.green, lastValue.brush.blue, lastValue.brush.alpha);
            const y = this.valueToY(lastValue.value);
            if (y == null) { continue; }

            if (this.isLeftAxis) {
                g.drawLine(this.leftAxisYWidth, y, this.leftAxisYWidth - 5, y, 1.0);
                g.drawText(lastValue.value.toFixed(this.digits), 0, y + 4);
            } else {
                g.drawLine(this.left, y, this.left + 5, y, 1.0);
                g.drawText(lastValue.value.toFixed(this.digits), this.left + 5, y + 4);
            }
        }
    }

    public valueToY(val: number): number | null {
        if (val > this.max || val < this.min) { return null; }
        const dv = (val - this.min) / (this.max - this.min);
        return Math.round(this.bottom - (this.bottom - this.top) * dv);
    }

    private calcMinMark(minV: number, maxV: number, height: number): number {
        const minMarkPx = 50.0;

        const count = Math.round(Math.floor(height / minMarkPx));
        const minMark = (maxV - minV) / count;
        return this.toRound(minMark);
    }

    private toCeil(val: number, mark: number): number {
        return Math.ceil(val / mark) * mark;
    }

    private toFloor(val: number, mark: number): number {
        return Math.floor(val / mark) * mark;
    }

    private toRound(d: number): number {
        let r = 0;
        if (d <= 0.000001) {
            r = 0.000001;
        } else if (d <= 0.000002) {
            r = 0.000002;
        } else if (d <= 0.000005) {
            r = 0.000005;
        } else if (d <= 0.00001) {
            r = 0.00001;
        } else if (d <= 0.00002) {
            r = 0.00002;
        } else if (d <= 0.00005) {
            r = 0.00005;
        } else if (d <= 0.0001) {
            r = 0.0001;
        } else if (d <= 0.0002) {
            r = 0.0002;
        } else if (d <= 0.0005) {
            r = 0.0005;
        } else if (d <= 0.001) {
            r = 0.001;
        } else if (d <= 0.002) {
            r = 0.002;
        } else if (d <= 0.005) {
            r = 0.005;
        } else if (d <= 0.01) {
            r = 0.01;
        } else if (d <= 0.02) {
            r = 0.02;
        } else if (d <= 0.05) {
            r = 0.05;
        } else if (d <= 0.1) {
            r = 0.1;
        } else if (d <= 0.2) {
            r = 0.2;
        } else if (d <= 0.5) {
            r = 0.5;
        } else if (d <= 1.0) {
            r = 1.0;
        } else if (d <= 2.0) {
            r = 2.0;
        } else if (d <= 5.0) {
            r = 5.0;
        } else if (d <= 10.0) {
            r = 10.0;
        } else if (d <= 20.0) {
            r = 20.0;
        } else if (d <= 50.0) {
            r = 50.0;
        } else if (d <= 100.0) {
            r = 100.0;
        } else if (d <= 200.0) {
            r = 200.0;
        } else if (d <= 500.0) {
            r = 500.0;
        } else if (d <= 1000.0) {
            r = 1000.0;
        } else if (d <= 2000.0) {
            r = 2000.0;
        } else if (d <= 5000.0) {
            r = 5000.0;
        } else if (d <= 10000.0) {
            r = 10000.0;
        } else if (d <= 20000.0) {
            r = 20000.0;
        } else if (d <= 50000.0) {
            r = 50000.0;
        } else if (d <= 100000.0) {
            r = 100000.0;
        } else if (d <= 200000.0) {
            r = 200000.0;
        } else if (d <= 500000.0) {
            r = 500000.0;
        } else if (d <= 1000000.0) {
            r = 1000000.0;
        } else if (d <= 2000000.0) {
            r = 2000000.0;
        } else if (d <= 5000000.0) {
            r = 5000000.0;
        } else if (d <= 10000000.0) {
            r = 10000000.0;
        } else if (d <= 20000000.0) {
            r = 20000000.0;
        } else if (d <= 50000000.0) {
            r = 50000000.0;
        } else if (d <= 100000000.0) {
            r = 100000000.0;
        } else if (d <= 200000000.0) {
            r = 200000000.0;
        } else if (d <= 500000000.0) {
            r = 500000000.0;
        } else if (d <= 1000000000.0) {
            r = 1000000000.0;
        }

        return r;
    }
}

