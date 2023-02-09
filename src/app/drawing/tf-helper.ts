import { Timeframes } from './timeframes';

export function getDates(date: Date, tf: Timeframes): Date[] {

    let d1 = new Date(); let d2 = new Date();

    switch (tf) {
        case Timeframes.Tick:
            d1 = date; d2 = date;
            break;
        case Timeframes.Min:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 1, 0);
            break;
        case Timeframes.Min5:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 5, 0);
            break;
        case Timeframes.Min10:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 10, 0);
            break;
        case Timeframes.Min15:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 15, 0);
            break;
        case Timeframes.Min20:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 20, 0);
            break;
        case Timeframes.Min30:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + 30, 0);
            break;
        case Timeframes.Hour:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, 0, 0);
            break;
        case Timeframes.Day:
            d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            d2 = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
            break;
        case Timeframes.Week:
            d1 = toStartWeek(date);
            d2 = toStartNextWeek(date);
            break;
    }

    return [d1, d2];
}

function toStartWeek(d: Date): Date {
    const year = d.getFullYear();
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    switch (d.getDay()) {
        case 2: // Tuesday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 0, 0, 0); break;
        case 3: // Wednesday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 2, 0, 0, 0); break;
        case 4: // Thursday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 3, 0, 0, 0); break;
        case 5: // Friday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 4, 0, 0, 0); break;
        case 6: // Saturday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 5, 0, 0, 0); break;
        case 0: // Sunday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6, 0, 0, 0); break;
    }

    if (d.getFullYear() < year) {
        d = new Date(year, 0, 1, 0, 0, 0);
    }

    return d;
}

function toStartNextWeek(d: Date): Date {
    const year = d.getFullYear();
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    switch (d.getDay()) {
        case 1: // Monday:
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7, 0, 0, 0); break;
        case 2: // Tuesday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6, 0, 0, 0); break;
        case 3: // Wednesday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 5, 0, 0, 0); break;
        case 4: // Thursday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 4, 0, 0, 0); break;
        case 5: // Friday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3, 0, 0, 0); break;
        case 6: // Saturday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 2, 0, 0, 0); break;
        case 0: // Sunday
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0); break;
    }

    if (d.getFullYear() > year) {
        d = new Date(d.getFullYear(), 0, 1, 0, 0, 0);
    }

    return d;
}
