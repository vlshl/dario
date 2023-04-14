import { Observable } from "rxjs";

export interface PxColumn {
    key: string;
    name: string;
    type: string;
}

export interface PxPlugin {
    getColumns(): Observable<PxColumn[]>,
    getData(): Observable<Object[]>
}

export interface PxPluginInfo {
    key: string;
    name: string;
    state: boolean;
}
