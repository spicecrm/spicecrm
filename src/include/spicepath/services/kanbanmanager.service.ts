import {Injectable} from '@angular/core';

import {forkJoin, Observable, Subject} from "rxjs";
import {tap, map} from "rxjs/operators";

import {backend} from "../../../services/backend.service";
import {
    SpiceBeanGuideChecksI,
    SpiceBeanGuidesI,
    SpiceBeanGuideStagesI
} from "../interfaces/kanbanmanager.interfaces";


@Injectable()
export class KanbanManagerService {
    public currentStages: SpiceBeanGuideStagesI[] = [];

    public currentChecks:SpiceBeanGuideChecksI[] = [];

    public currentStagesSpiceTexts: [] = [];
    public currentStagesChecks: [] = [];

    public stages: SpiceBeanGuideStagesI[] = [];

    public checks: SpiceBeanGuideChecksI[] = [];

    public domainFieldValidations: any = [];
    public domainFieldValidationsValues: any = [];

    public minimized: boolean = false;

    public constructor(public backend: backend) {
        this.loadItems();
        this.loadChecks();
        this.loadValidations();
    }


    /**
     * holds the selected bean guide
     */
    private _selectedBeanGuide: SpiceBeanGuidesI;

    set selectedBeanGuide(val:SpiceBeanGuidesI) {
        this._selectedBeanGuide = val;
        this.currentStages = this.stages.filter(dis=> dis.spicebeanguide_id == this.selectedBeanGuide.id);
        this.currentChecks = this.checks.filter(check=>check.spicebeanguide_id == this.selectedBeanGuide.id);

        this.selectedBeanGuide$.next(val);
    }

    get selectedBeanGuide() {
        return this._selectedBeanGuide;
    }

    public selectedBeanGuide$: Subject<any> = new Subject<any>();


    public getBeanGuides(): Observable<SpiceBeanGuidesI[]> {
        const data1: Observable<SpiceBeanGuidesI> = this.backend.getRequest(`configuration/configurator/entries/spicebeanguides`).pipe(
            tap((res) => {
                res.map(data => data.scope = 'global');
            })
        );
        const data2: Observable<SpiceBeanGuidesI> = this.backend.getRequest(`configuration/configurator/entries/spicebeancustomguides`).pipe(
            tap((res) => {
                res.map(data => data.scope = 'custom');
            })
        );

        return forkJoin([data1, data2]).pipe(
                    map(responses => {
                        return [].concat(...responses);
                    })
                );
    }

    public loadValidations() {
        this.backend.getRequest(`configuration/configurator/entries/sysdomainfieldvalidations`).subscribe(validations => {
            this.domainFieldValidations = validations;
        })

        this.backend.getRequest(`configuration/configurator/entries/sysdomainfieldvalidationvalues`).subscribe(validationsValues => {
            this.domainFieldValidationsValues = validationsValues;
        })
    }

    /**
     * load spice bean guide items from backend
     */
    public loadItems() {
        this.backend.getRequest(`configuration/configurator/entries/spicebeanguidestages`).subscribe(stages => {
            this.stages = stages.sort((a, b) => +a.stage_sequence > +b.stage_sequence ? 1 : -1);
        })
    }

    /**
     * load checks from backend
     */
    public loadChecks() {
        this.backend.getRequest(`configuration/configurator/entries/spicebeanguidestages_checks`).subscribe(checks => {
            this.checks = checks;
        })
    }

    /**
     * saving the new sequence of beanguidestages
     */
    public saveSequence() {

        this.stages.forEach((entry, index) => {
            entry.stage_sequence = index;
        });

        this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config: this.stages});

    }

    /**
     * toggles the minimized flag
     */
    public toggleMinimized() {
        this.minimized = !this.minimized;
    }
}
