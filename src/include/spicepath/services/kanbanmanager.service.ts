import {Injectable} from '@angular/core';
import {Observable, Subject} from "rxjs";

import {backend} from "../../../services/backend.service";
import {SpiceBeanGuidesI, SpiceBeanGuideStagesI} from "../interfaces/kanbanmanager.interfaces";


@Injectable()
export class KanbanManagerService {

    public stages:SpiceBeanGuideStagesI[] = [];

    public constructor(public backend: backend) {
        this.loadItems();
    }


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


    public getBeanGuides(): Observable<SpiceBeanGuidesI[]> {
        return this.backend.getRequest(`configuration/configurator/entries/spicebeanguides`);
    }

    /**
     * load spice bean guide items from backend
     */
    public loadItems() {
        this.backend.getRequest(`configuration/configurator/entries/spicebeanguidestages`).subscribe(stages =>{
            this.stages = stages;
        })
    }

    /**
     * saving the new sequence of beanguidestages
     */
    public saveSequence() {

        this.stages.forEach((entry, index) => {
            entry.stage_sequence = index;
        });

        this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config:this.stages});

    }
}
