import { IGraphics } from './igraphics';

export class Graphics implements IGraphics {

    constructor(private ctx: CanvasRenderingContext2D) { 
        this.width = 0;
        this.height = 0;
    }

    width: number;
    height: number;

    setCurrentTextFormat(fontFamily: string, isBold: boolean, fontSize: number) {
        let font = '';
        if (isBold) { font = 'bold '; }
        this.ctx.font = font + fontSize.toString() + 'px ' + fontFamily;
    }

    drawRectangle(left: number, top: number, right: number, bottom: number, width: number) {
        this.ctx.rect(left + 0.5, top + 0.5, right - left, bottom - top);
        this.ctx.stroke();
    }

    clear(red: number, green: number, blue: number, alpha: number) {
        const style = this.ctx.fillStyle;
        this.ctx.fillStyle = 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ','
            + (alpha / 255).toString() + ')';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = style;
    }

    fillRectangle(left: number, top: number, right: number, bottom: number) {
        this.ctx.fillRect(left, top, right - left + 1, bottom - top + 1);
    }

    reset(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    setCurrentColor(red: number, green: number, blue: number, alpha: number) {
        if (red < 0)  {red = 0; } if (red > 255) { red = 255; }
        if (green < 0) { green = 0; } if (green > 255) { green = 255; }
        if (blue < 0) { blue = 0; } if (blue > 255) { blue = 255; }
        if (alpha < 0) { alpha = 0; } if (alpha > 255) { alpha = 255; }
        this.ctx.fillStyle = 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ','
            + (alpha / 255).toString() + ')';
        this.ctx.strokeStyle = 'rgba(' + red.toString() + ',' + green.toString() + ',' + blue.toString() + ','
            + (alpha / 255).toString() + ')';
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, lineWidth: number) {
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWidth;
        let xh1 = 0.5; let yh1 = 0.5;
        let xh2 = 0.5; let yh2 = 0.5;
        if (x1 === x2) {
            yh1 = 0; yh2 = 1;
            if (y1 > y2) {
                const ys = y1; y1 = y2; y2 = ys;
            }
        }
        if (y1 === y2) {
            xh1 = 0; xh2 = 1;
            if (x1 > x2) {
                const xs = x1; x1 = x2; x2 = xs;
            }
        }
        this.ctx.moveTo(x1 + xh1, y1 + yh1);
        this.ctx.lineTo(x2 + xh2, y2 + yh2);
        this.ctx.stroke();
    }

    drawText(text: string, x: number, y: number) {
        this.ctx.fillText(text, x, y);
    }
}



