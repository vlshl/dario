import { IGraphics } from './igraphics';
import { ChartBrush } from './chart-brush';
import { Timeline } from './timeline';

export interface IVisual {
    key: number;
    draw(g: IGraphics, axisX: IAxisX, axisY: IAxisY): void;
    getMinMax(axisX: IAxisX): number[] | null;
    getLastValue(axisX: IAxisX): number | null;
    getBrush(): ChartBrush;
}

export interface IAxisX {
    readonly barWidthPx: number;
    readonly betweenBarsPx: number;
    readonly timeline: Timeline;
    readonly startIndex: number;
    readonly endIndex: number;
    indexToX(index: number): number | null;
}

export interface IAxisY {
    valueToY(val: number): number | null;
}

export interface LastValue {
    value: number;
    brush: ChartBrush;
}


