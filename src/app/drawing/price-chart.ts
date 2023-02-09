import { BarRow } from './bar-row';
import { ChartBrush } from './chart-brush';
import { IGraphics } from './igraphics';
import { IAxisX, IAxisY, IVisual } from './interfaces';

export class PriceChart implements IVisual {

    private brush: ChartBrush;

    constructor(public key: number, public barRow: BarRow) {
        this.brush = new ChartBrush(0, 0, 0);
    }

    draw(g: IGraphics, axisX: IAxisX, axisY: IAxisY): void {
        const bw = (axisX.barWidthPx - 1) / 2; // половина ширины бара
        g.setCurrentColor(this.brush.red, this.brush.green, this.brush.blue, this.brush.alpha);

        for (let i = axisX.startIndex; i <= axisX.endIndex; i++) {
            const bar = this.barRow.getBar(i);
            if (bar == null)  {continue; }

            const x = axisX.indexToX(i);
            if (x == null) { continue; }

            const yOpen = axisY.valueToY(bar.open);
            if (yOpen == null) { continue; }

            const yClose = axisY.valueToY(bar.close);
            if (yClose == null) { continue; }

            const yHigh = axisY.valueToY(bar.high);
            if (yHigh == null) { continue; }

            const yLow = axisY.valueToY(bar.low);
            if (yLow == null) { continue; }

            if (bar.open < bar.close) { // white bar
                g.drawRectangle(x - bw, yClose, x + bw, yOpen, 1);
                g.drawLine(x, yClose, x, yHigh, 1);
                g.drawLine(x, yOpen, x, yLow, 1);
            } else { // black bar
                g.fillRectangle(x - bw, yOpen, x + bw, yClose);
                g.drawLine(x, yOpen, x, yHigh, 1);
                g.drawLine(x, yClose, x, yLow, 1);
            }
        }
    }

    getMinMax(axisX: IAxisX): number[] | null {
        let min: number | null = null; let max: number | null = null;
        for (let i = axisX.startIndex; i <= axisX.endIndex; i++) {
            const bar = this.barRow.getBar(i);
            if (bar == null) { continue; }

            const high = bar.high; const low = bar.low;
            if (max == null || high > max) { max = high; }
            if (min == null || low < min) { min = low; }
        }
        if (min == null || max == null) return null;

        return [ min, max ];
    }

    getLastValue(axisX: IAxisX): number | null {
        let lastValue: number | null = null;
        for (let i = axisX.endIndex; i >= axisX.startIndex; i--) {
            const bar = this.barRow.getBar(i);
            if (bar == null) { continue; }
            lastValue = bar.close;
            break;
        }

        return lastValue;
    }

    getBrush(): ChartBrush {
        return this.brush;
    }

    setBrush(brush: ChartBrush) {
        this.brush = brush;
    }
}
