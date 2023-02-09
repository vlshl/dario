import { DecimalPipe } from '@angular/common';

export class Bar {
    constructor(
        public open: number,
        public close: number,
        public high: number,
        public low: number,
        public volume: number) {}
}
