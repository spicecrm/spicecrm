import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";

import {backend} from "../../../services/backend.service";


export interface IBeanGuides {
    id: string;
    module: string;
    status_field: string;
    build_language?: string;
    name: string;
}

@Injectable()
export class KanbanManagerService {

    public constructor(
        public backend: backend,
    ) {}


    /**
     * holds the selected bean guide
     */
    private _selectedBeanGuide;

    set selectedBeanGuide(val) {
        this._selectedBeanGuide = val;

        this.selectedBeanGuide$.next(val);
    }

    get selectedBeanGuide() {
        return this._selectedBeanGuide;
    }

    public selectedBeanGuide$: Subject<any> = new Subject<any>();


    public getBeanGuides(): Observable<IBeanGuides[]> {
        return this.backend.getRequest(`configuration/configurator/entries/spicebeanguides`);
    }


}
