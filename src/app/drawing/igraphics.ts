export interface IGraphics {
    reset(width: number, height: number): void;
    drawLine(x1: number, y1: number, x2: number, y2: number, width: number): void;
    drawText(test: string, x: number, y: number): void;
    setCurrentColor(red: number, green: number, blue: number, alpha: number): void;
    fillRectangle(left: number, top: number, right: number, bottom: number): void;
    setCurrentTextFormat(fontFamily: string, isBold: boolean, fontSize: number): void;
    fillRectangle(left: number, top: number, right: number, bottom: number): void;
    drawRectangle(left: number, top: number, right: number, bottom: number, strokeWidth: number): void;
    clear(red: number, green: number, blue: number, alpha: number): void;

    readonly width: number;
    readonly height: number;
}
