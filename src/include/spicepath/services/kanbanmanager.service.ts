import {Injectable} from '@angular/core';

import {forkJoin, Observable, Subject} from "rxjs";
import {tap, map} from "rxjs/operators";

import {backend} from "../../../services/backend.service";
import {
    SpiceBeanGuideChecksI,
    SpiceBeanGuidesI,
    SpiceBeanGuideStagesI, SpiceTextsI
} from "../interfaces/kanbanmanager.interfaces";
import {toast} from "../../../services/toast.service";
import _ from "underscore";


@Injectable()
export class KanbanManagerService {
    public currentStages: SpiceBeanGuideStagesI[] = [];

    public currentChecks:SpiceBeanGuideChecksI[] = [];

    public currentStagesChecks: [] = [];

    public stages: SpiceBeanGuideStagesI[] = [];

    public checks: SpiceBeanGuideChecksI[] = [];

    /**
     * holds all SpiceTexts from backend for all SpiceBeanGuides
     */
    public spiceTexts: SpiceTextsI[] = [];

    /**
     * holds current SpiceText for selected SpiceBeanGuide
     */
    public currentBeanGuideSpiceTexts: SpiceTextsI[] = [];

    public domainFieldValidations: any = [];
    public domainFieldValidationsValues: any = [];

    public minimized: boolean = false;

    public changed = {stages: [], checks: [], spiceTexts: []};



    public constructor(
        public backend: backend,
        public toast: toast
    ) {
        this.loadItems();
        this.loadChecks();
        this.loadValidations();
        this.loadSpiceTexts();
    }

    /**
     * @return boolean true if the current bean guide has changes
     */
    get hasChanges(): boolean {
        return this.changed.checks.length > 0 || this.changed.stages.length > 0 || this.changed.spiceTexts.length > 0;
    }

    /**
     * compare
     */
    public detectChanges(item: SpiceBeanGuideStagesI | SpiceTextsI | SpiceBeanGuideChecksI, type: 'stages' | 'checks' | 'spiceTexts') {

        this[type].some(s => {
            if (s.id != item.id) return false;

            if (JSON.stringify(item) == JSON.stringify(s)) {
                this.changed[type] = this.changed[type].filter(c => c.id != item.id);
            } else {
                const idx = this.changed[type].findIndex(c => c.id == item.id);
                if (idx > -1) {
                    this.changed[type][idx] = item;
                } else {
                    this.changed[type].push({...item});
                }
            }
        });
    }


    /**
     * holds the selected bean guide
     */
    private _selectedBeanGuide: SpiceBeanGuidesI;

    set selectedBeanGuide(val:SpiceBeanGuidesI) {
        this._selectedBeanGuide = val;

        if(val) {
            this.currentStages = this.stages.filter(dis=> dis.spicebeanguide_id == this.selectedBeanGuide.id).map(e => ({...e}));
            this.currentChecks = this.checks.filter(check=>check.spicebeanguide_id == this.selectedBeanGuide.id).map(e => ({...e}));

            // filters spice texts for selected spice bean guide
            this.currentBeanGuideSpiceTexts = this.spiceTexts.filter(spiceTexts => spiceTexts.spiceBeanGuideId == this.selectedBeanGuide.id).map(e => ({...e}));
        }

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
    public loadItems(selected = null) {
        this.backend.getRequest(`configuration/configurator/entries/spicebeanguidestages`).subscribe(stages => {
            this.stages = stages.map(s => {
                s.not_in_kanban = s.not_in_kanban  == 1 ? 1 : 0;
                return s;
            }).sort((a, b) => +a.stage_sequence > +b.stage_sequence ? 1 : -1);
            this.selectedBeanGuide = selected;
        })
    }

    /**
     * load spice texts for SpiceBeanGuideStages from backend
     */
    public loadSpiceTexts() {
        this.backend.getRequest(`module/SpiceTexts/SpiceBeanGuideStages/load`).subscribe({
            next: (resp: SpiceTextsI[]) => {
                // transform Object to Array
                this.spiceTexts = _.toArray(resp);
            }, error: (err) => {
                this.toast.sendToast('LBL_ERROR' + ': ' + err, 'error');
            }
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
     *
     */
    public save() {

        const resArray = [];

        if (this.changed.stages.length > 0) {
            resArray.push(
                this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config: this.changed.stages})
            );
        }

        if (this.changed.checks.length > 0) {
            resArray.push(
                this.backend.postRequest(`configuration/configurator/spicebeanguidestages_checks`, null, {config: this.changed.checks})
            );
        }

        if (this.changed.spiceTexts.length > 0) {
            resArray.push(
                this.backend.postRequest(`configuration/configurator/spicetexts`, null, {config: this.changed.spiceTexts})
            );
        }

        forkJoin(resArray).subscribe(() => {
            Object.keys(this.changed).forEach(type => {
                this.changed[type].forEach((changedItem, i) => {
                    const idx = this[type].findIndex(item => item.id == changedItem.id);
                    this[type][idx] = {...changedItem};
                });

                this.changed[type] = [];
            });

            this.toast.sendToast('LBL_DATA_SAVED', 'success');
        });
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
