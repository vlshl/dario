import { Timeline } from './timeline';
import { ChartBrush } from './chart-brush';
import { Timeframes } from './timeframes';
import { IGraphics } from './igraphics';
import { IAxisX } from './interfaces';

export class AxisX implements IAxisX {
    private startX: number;
    private endX: number;
    private stepX: number;
    private gap: number;
    private axisXHeightHalf: number;
    private foreBrush: ChartBrush;
    private gridBrush: ChartBrush;
    private bgBrush: ChartBrush;
    private startIdx: number;
    private endIdx: number;
    private beginMovingIndex: number;

    constructor(
        public readonly timeline: Timeline,
        private axisXHeight: number,
        private leftAxisYWidth: number,
        private rightAxisYWidth: number,
        public readonly barWidthPx: number = 5,
        public readonly betweenBarsPx: number = 1) {

        this.gap = 3;
        this.foreBrush = new ChartBrush(0, 0, 0);
        this.gridBrush = new ChartBrush(200, 200, 200);
        this.bgBrush = new ChartBrush(0xf0, 0xf0, 0xf0);
        this.axisXHeightHalf = axisXHeight / 2.0;
        this.startIdx = -1;
        this.endIdx = 0;
        this.startX = this.endX = 0;
        this.stepX = barWidthPx + betweenBarsPx;
        this.beginMovingIndex = 0;
    }

    public beginMoving() {
        this.beginMovingIndex = this.startIndex;
    }

    public moving(dx: number) {
        const shift = Math.floor(dx / this.stepX);
        let idx = this.beginMovingIndex - shift;
        if (idx > this.timeline.count - 1) {
            idx = this.timeline.count - 1;
        } else {
            if (idx < 0) { idx = 0; }
        }
        this.startIdx = idx;
    }

    draw(g: IGraphics, isDynamic: boolean) {
        const top = g.height - this.axisXHeight;
        const left = this.leftAxisYWidth;
        const right = g.width - this.rightAxisYWidth;
        this.startX = left + (this.barWidthPx + 1) / 2 + this.gap;
        this.endX = right - (this.barWidthPx + 1) / 2 - this.gap;

        if (this.startIdx < 0) {
            if (isDynamic) {
                const barCount = Math.floor((this.endX - this.startX) / this.stepX);
                this.startIdx = this.timeline.count - barCount;
                if (this.startIdx < 0) { this.startIdx = 0; }
            } else {
                this.startIdx = 0;
            }
        }

        g.setCurrentColor(this.bgBrush.red, this.bgBrush.green, this.bgBrush.blue, this.bgBrush.alpha);
        g.fillRectangle(0, top, g.width, g.height);

        let index = this.startIdx;
        let x = this.startX;

        while (x < this.endX && index < this.timeline.count) {
            const cd = this.timeline.start(index);
            if (cd !== null) {
                if (this.stepX > 4.0) {
                    g.setCurrentColor(this.foreBrush.red, this.foreBrush.green, this.foreBrush.blue, this.foreBrush.alpha);
                    g.drawLine(x, top, x, top + 3, 1.0);
                }

                if (this.timeline.timeframe === Timeframes.Day) {
                    let pd = this.timeline.start(index - 1);
                    if (pd !== null) {
                        this.drawMark_Day(g, cd, pd, top, x);
                    }
                } else {
                    this.drawMark(g, this.timeline, index, x, this.stepX, top);
                }
            }

            x += this.stepX; index++;
        }

        g.drawLine(left, top, right, top, 1.0);
        this.endIdx = index - 1;
    }

    private drawMark(g: IGraphics, dates: Timeline, index: number, x: number, stepX: number, top: number) {
        let w = 0;
        if (index >= dates.count || index < 1) { return; }

        let cd = dates.start(index);
        let pd = dates.start(index - 1);
        if (cd == null || pd == null) { return; }

        let curDate = cd; let prevDate = pd;

        let isDraw = false;
        if (dates.timeframe == Timeframes.Min) {
            w = 100.0;
            if (stepX * 10 >= w) {
                isDraw = curDate.getMinutes() % 10 == 0;
            } else if (stepX * 15 >= w) {
                isDraw = curDate.getMinutes() % 15 == 0;
            } else if (stepX * 20 >= w) {
                isDraw = curDate.getMinutes() % 20 == 0;
            } else if (stepX * 30 >= w) {
                isDraw = curDate.getMinutes() % 30 == 0;
            } else if (stepX * 60 >= w) {
                isDraw = curDate.getMinutes() == 0;
            }
        } else if (dates.timeframe == Timeframes.Min5) {
            w = 100.0;
            if (this.dayOfYear(prevDate) != this.dayOfYear(curDate)) {
                isDraw = true;
            } else if (stepX * 12 >= w) {
                isDraw = curDate.getMinutes() == 0;
            } else if (stepX * 24 >= w) {
                isDraw = curDate.getMinutes() == 0 && curDate.getHours() % 2 == 0;
            } else if (stepX * 48 >= w) {
                isDraw = curDate.getMinutes() == 0 && curDate.getHours() % 4 == 0;
            }
        } else if (dates.timeframe == Timeframes.Min10) {
            w = 100.0;
            if (this.dayOfYear(prevDate) != this.dayOfYear(curDate)) {
                isDraw = true;
            } else if (stepX * 3 >= w) {
                isDraw = curDate.getMinutes() % 30 == 0;
            } else if (stepX * 6 >= w) {
                isDraw = curDate.getMinutes() == 0;
            } else if (stepX * 12 >= w) {
                isDraw = curDate.getMinutes() == 0 && curDate.getHours() % 2 == 0;
            } else if (stepX * 24 >= w) {
                isDraw = curDate.getMinutes() == 0 && curDate.getHours() % 4 == 0;
            }
        } else if (dates.timeframe == Timeframes.Min15) {
            w = 100.0;
            if (prevDate.getMonth() != curDate.getMonth()) {
                isDraw = true;
            } else if (stepX * 4 >= w) {
                isDraw = curDate.getMinutes() == 0;
            } else if (stepX * 8 >= w) {
                isDraw = curDate.getMinutes() == 0 && curDate.getHours() % 2 == 0;
            } else if (stepX * 16 >= w) {
                isDraw = curDate.getMinutes() == 0 && curDate.getHours() % 4 == 0;
            } else if (stepX * 32 >= w) {
                isDraw = this.dayOfYear(prevDate) != this.dayOfYear(curDate);
            } else if (stepX * 64 >= w) {
                isDraw = this.dayOfYear(prevDate) != this.dayOfYear(curDate) && curDate.getDate() % 2 == 0;
            } else if (stepX * 128 >= w) {
                isDraw = this.dayOfYear(prevDate) != this.dayOfYear(curDate) && curDate.getDay() == 1; // понедельник
            }
        } else if (dates.timeframe == Timeframes.Hour) {
            w = 50.0;
            if (stepX * 8 >= w) {
                isDraw = this.dayOfYear(curDate) != this.dayOfYear(prevDate);
            } else if (stepX * 40 >= w) {
                isDraw = this.isDiffWeek(prevDate, curDate);
            } else if (stepX * 160 >= w) {
                isDraw = prevDate.getMonth() != curDate.getMonth();
            }
        } else if (dates.timeframe == Timeframes.Day) {
            w = 50.0;
            if (stepX * 8 >= w) {
                isDraw = this.isDiffWeek(prevDate, curDate);
            } else if (stepX * 40 >= w) {
                isDraw = prevDate.getMonth() != curDate.getMonth();
            }
        }

        if (isDraw) {
            g.setCurrentColor(this.gridBrush.red, this.gridBrush.green, this.gridBrush.blue, this.gridBrush.alpha);
            g.drawLine(x, 0, x, top, 1.0); // grid
            let isBig = false;
            g.setCurrentColor(this.foreBrush.red, this.foreBrush.green, this.foreBrush.blue, this.foreBrush.alpha);

            if (dates.timeframe == Timeframes.Min) {
                if (this.dayOfYear(curDate) != this.dayOfYear(prevDate)) {
                    isBig = true;
                    g.setCurrentTextFormat('Arial', true, 11);
                    g.drawText(this.dateToStr(curDate), x + 5, top + 16);
                }
                else {
                    isBig = false;
                    g.setCurrentTextFormat('Arial', false, 11);
                    g.drawText(this.toStringD2(curDate.getHours()) + ":" + this.toStringD2(curDate.getMinutes()),
                        x - 14, top + 16);
                }
            }
            else if (dates.timeframe == Timeframes.Min5) {
                if (this.dayOfYear(curDate) != this.dayOfYear(prevDate)) {
                    isBig = true;
                    g.setCurrentTextFormat('Arial', true, 11);
                    g.drawText(this.dateToStr(curDate), x + 5, top + 16);
                }
                else {
                    isBig = false;
                    g.setCurrentTextFormat('Arial', false, 11);
                    g.drawText(this.toStringD2(curDate.getHours()) + ":" + this.toStringD2(curDate.getMinutes()),
                        x - 14, top + 16);
                }
            }
            else if (dates.timeframe == Timeframes.Min10) {
                if (this.dayOfYear(curDate) != this.dayOfYear(prevDate)) {
                    isBig = true;
                    g.setCurrentTextFormat('Arial', true, 11);
                    g.drawText(this.dateToStr(curDate), x + 5, top + 16);
                }
                else {
                    isBig = false;
                    g.setCurrentTextFormat('Arial', false, 11);
                    g.drawText(this.toStringD2(curDate.getHours()) + ":" + this.toStringD2(curDate.getMinutes()),
                        x - 14, top + 16);
                }
            }
            else if (dates.timeframe == Timeframes.Min15) {
                if (this.dayOfYear(curDate) != this.dayOfYear(prevDate) || curDate.getMonth() != prevDate.getMonth()) {
                    isBig = true;
                    g.setCurrentTextFormat('Arial', true, 11);
                    g.drawText(this.dateToStr(curDate), x + 5, top + 16);
                }
                else {
                    isBig = false;
                    g.setCurrentTextFormat('Arial', false, 11);
                    g.drawText(this.toStringD2(curDate.getHours()) + ":" + this.toStringD2(curDate.getMinutes()),
                        x - 14, top + 16);
                }
            }
            else if (dates.timeframe == Timeframes.Hour) {
                if (this.dayOfYear(curDate) != this.dayOfYear(prevDate) || curDate.getMonth() != prevDate.getMonth()) {
                    isBig = true;
                    g.setCurrentTextFormat('Arial', true, 11);
                    g.drawText(this.dateToStr(curDate), x + 5, top + 16);
                }
                else {
                    isBig = false;
                    g.setCurrentTextFormat('Arial', false, 11);
                    g.drawText(this.toStringD2(curDate.getHours()) + ":" + this.toStringD2(curDate.getMinutes()),
                        x + 5, top + 16);
                }
            }
            else if (dates.timeframe == Timeframes.Day) {
                //if (curDate.DayOfYear != prevDate.DayOfYear || curDate.Month != prevDate.Month)
                //{
                isBig = true;
                g.setCurrentTextFormat('Arial', true, 11);
                g.drawText(this.dateToStr(curDate), x + 5, top + 16);
                //}
                //else
                //{
                //    isBig = false;
                //    renderTarget.DrawText(curDate.Hour.ToString("D2") + ":" + curDate.Minute.ToString("D2"),
                //        resFactory.GetTextFormat(0),
                //        new RectF(x - 14, bottom + 5, x + 16, bottom + 25), brush);
                //}
            }

            g.drawLine(x, top, x, top + (isBig ? 15 : 5), 1.0);
        }
    }

    private drawMark_Day(g: IGraphics, curDate: Date, prevDate: Date, top: number, x: number) {
        const w = 50;
        if (this.stepX * 8 >= w) {
            if (prevDate.getMonth() != curDate.getMonth()) {
                let txt = '';
                if (curDate.getMonth() === 0) {
                    txt = curDate.getFullYear().toString();
                }
                else {
                    txt = this.month2Str(curDate.getMonth() + 1);
                }
                this.drawBigMark(g, x, top, curDate.getDate().toString(), txt);
            }
            else if (this.isDiffWeek(prevDate, curDate)) {
                this.drawSmallMark(g, x, top, curDate.getDate().toString());
            }
        }
        else if (this.stepX * 40 >= w) {
            if (prevDate.getFullYear() != curDate.getFullYear()) {
                this.drawBigMark(g, x, top, this.month2Str(curDate.getMonth() + 1), curDate.getFullYear().toString());
            }
            else if (prevDate.getMonth() != curDate.getMonth()) {
                this.drawSmallMark(g, x, top, this.month2Str(curDate.getMonth() + 1));
            }
        }
        else if (this.stepX * 100 >= w) {
            if (prevDate.getFullYear() != curDate.getFullYear()) {
                this.drawSmallMark(g, x, top, curDate.getFullYear().toString());
            }
        }
    }

    private drawSmallMark(g: IGraphics, x: number, y: number, text: string) {
        g.setCurrentColor(this.gridBrush.red, this.gridBrush.green, this.gridBrush.blue, this.gridBrush.alpha);
        g.drawLine(x, 0, x, y, 1); // grid
        g.setCurrentTextFormat('Arial', true, 11);
        g.setCurrentColor(this.foreBrush.red, this.foreBrush.green, this.foreBrush.blue, this.foreBrush.alpha);
        g.drawText(text, x + 3, y + 14);
        g.drawLine(x, y, x, y + this.axisXHeightHalf, 1);
    }

    private drawBigMark(g: IGraphics, x: number, y: number, text: string, bigtext: string) {
        g.setCurrentColor(this.gridBrush.red, this.gridBrush.green, this.gridBrush.blue, this.gridBrush.alpha);
        g.drawLine(x, 0, x, y, 1); // grid
        g.setCurrentTextFormat('Arial', true, 11);
        g.setCurrentColor(this.foreBrush.red, this.foreBrush.green, this.foreBrush.blue, this.foreBrush.alpha);
        g.drawText(text, x + 3, y + 14);
        g.drawText(bigtext, x + 3, y + this.axisXHeightHalf + 11);
        g.drawLine(x, y, x, y + this.axisXHeight, 1);
    }

    private month2Str(month: number): string {
        let res = '';
        switch (month) {
            case 1: res = 'Jan'; break;
            case 2: res = 'Feb'; break;
            case 3: res = 'Mar'; break;
            case 4: res = 'Apr'; break;
            case 5: res = 'May'; break;
            case 6: res = 'Jun'; break;
            case 7: res = 'Jul'; break;
            case 8: res = 'Aug'; break;
            case 9: res = 'Sep'; break;
            case 10: res = 'Oct'; break;
            case 11: res = 'Nov'; break;
            case 12: res = 'Dec'; break;
        }

        return res;
    }

    private dateToStr(date: Date): string {
        return date.getDate().toString() + ' ' + this.month2Str(date.getMonth() + 1);
    }

    private dayOfYear(d: Date): number {
        const yn = d.getFullYear();
        const mn = d.getMonth();
        const dn = d.getDate();
        const d1 = new Date(yn, 0, 1, 12, 0, 0);
        const d2 = new Date(yn, mn, dn, 12, 0, 0);
        const ddiff = Math.round((+d2 - +d1) / 864e5);

        return ddiff + 1;
    }

    private toStringD2(n: number): string {
        const s = n.toString();
        if (s.length < 2) { return '0' + s; }
        return s;
    }

    // разные недели или нет
    private isDiffWeek(d1: Date, d2: Date): boolean {
        if (d1.getFullYear() !== d2.getFullYear()) { return true; }
        if (Math.abs(this.dayOfYear(d1) - this.dayOfYear(d2)) >= 7) {
            return true;
        }

        let dow1 = d1.getDay(); if (dow1 === 0) { dow1 = 7; }
        let dow2 = d2.getDay(); if (dow2 === 0) { dow2 = 7; }

        return dow1 > dow2;
    }

    public indexToX(index: number): number | null {
        if (index < this.startIdx || index > this.endIdx || this.endX === 0) {
            return null;
        }

        const idx = index - this.startIdx;
        return this.startX + idx * this.stepX;
    }

    public get startIndex() {
        return this.startIdx;
    }

    public get endIndex() {
        return this.endIdx;
    }
}
