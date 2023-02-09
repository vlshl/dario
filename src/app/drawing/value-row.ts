export class ValueRow {

    private vls: Array<number | null>;

    constructor() {
        this.vls = [];
    }

    add(v: number | null) {
        this.vls.push(v);
    }

    getValue(i: number) {
        return this.vls[i];
    }
}
