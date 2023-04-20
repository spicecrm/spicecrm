import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class KanbanManagerService {
    /**
     * holds the bean guides
     */
    public beanGuides = [];
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


}