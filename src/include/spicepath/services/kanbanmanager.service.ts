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
import {ChangeHistoryService} from "../../../workbench/services/changehistory.service";


@Injectable()
export class KanbanManagerService {
    public currentStages: SpiceBeanGuideStagesI[] = [];

    public currentChecks:SpiceBeanGuideChecksI[] = [];

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

    public constructor(
        public backend: backend,
        public toast: toast,
        private changeService: ChangeHistoryService
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
        return this.changeService.hasChanges('checks') || this.changeService.hasChanges('stages') || this.changeService.hasChanges('spiceTexts');
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

        if (this.changeService.hasChanges('stages')) {
            resArray.push(
                this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config: this.changeService.getLatestChanges('stages')})
            );
        }

        if (this.changeService.hasChanges('checks')) {
            resArray.push(
                this.backend.postRequest(`configuration/configurator/spicebeanguidestages_checks`, null, {config: this.changeService.getLatestChanges('checks')})
            );
        }

        if (this.changeService.hasChanges('spiceTexts')) {
            resArray.push(
                this.backend.postRequest(`configuration/configurator/spicetexts`, null, {config: this.changeService.getLatestChanges('spiceTexts')})
            );
        }

        forkJoin(resArray).subscribe(() => {
            ['stages', 'checks', 'spiceTexts'].forEach(name => {
                this.changeService.getLatestChanges(name).forEach((changedItem, i) => {
                    const idx = this[name].findIndex(item => item.id == changedItem.id);
                    this[name][idx] = {...changedItem};
                    this.changeService.resetObjectChanges(name, changedItem);
                });
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
