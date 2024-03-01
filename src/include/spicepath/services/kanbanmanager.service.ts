import {Injectable} from '@angular/core';

import {forkJoin, Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";

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
    public currentStageTexts: SpiceTextsI[] = [];

    public domainFieldValidations: any = [];
    public domainFieldValidationsValues: any = [];

    public minimized: boolean = false;

    public constructor(
        public backend: backend,
        public toast: toast,
        public changeService: ChangeHistoryService
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
            this.setCurrentChecks();
            this.setCurrentStageTexts();
        }

        this.selectedBeanGuide$.next(val);
    }

    /**
     * set current spice texts
     * @private
     */
    private setCurrentStageTexts() {

        this.currentStageTexts = [];

        this.currentStages.forEach(stage => {
            this.currentStageTexts = this.currentStageTexts.concat(this.spiceTexts.filter(t => t.parent_id == stage.id).map(e => ({...e})));
        })
    }

    get selectedBeanGuide() {
        return this._selectedBeanGuide;
    }

    /**
     * filters spice checks for selected spice bean guide
     * @private
     */
    private setCurrentChecks() {
        this.currentChecks = this.checks.filter(check=>check.spicebeanguide_id == this._selectedBeanGuide.id).map(e => ({...e}));
    }

    /**
     * generate a trackable object by the change service which can be used instead of the original
     * object to track changes on the given object and register them on change service
     * @param obj
     * @param key
     */
    public generateTrackableObject(obj: any, key: 'checks' | 'stages' | 'spiceTexts'): any {
        const dbObject = (this[key] as any[]).find(s => s.id == obj.id);
        return this.changeService.generateTrackableObject(obj, dbObject, key);
    }

    /**
     * generate a trackable object by the change service which can be used instead of the original
     * object to track changes on the given object and register them on change service
     * @param obj
     * @param key
     * @param validator
     */
    public generateTrackableNewObject(obj: any, key: 'checks' | 'stages' | 'spiceTexts', validator?: (obj: any) => boolean): any {
        return this.changeService.generateTrackableNewObject(obj, key, validator);
    }

    public selectedBeanGuide$: Subject<any> = new Subject<any>();

    public getBeanGuides(): Observable<SpiceBeanGuidesI[]> {
        const custom: Observable<SpiceBeanGuidesI[]> = this.backend.getRequest(`configuration/configurator/entries/spicebeancustomguides`);
        const global: Observable<SpiceBeanGuidesI[]> = this.backend.getRequest(`configuration/configurator/entries/spicebeanguides`);

        return forkJoin([custom, global]).pipe(map(([c, g]) => [...c.map(i => ({...i, scope: 'custom'})), ...g.map(i => ({...i, scope: 'global'}))]));
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
        const stagesCustom = this.backend.getRequest(`configuration/configurator/entries/spicebeancustomguidestages`);
        const stagesGlobal = this.backend.getRequest(`configuration/configurator/entries/spicebeanguidestages`)

        forkJoin([stagesCustom, stagesGlobal])
            .pipe(map(([c, g]) => [...c.map(i => ({...i, scope: 'custom'})), ...g.map(i => ({...i, scope: 'global'}))]))
            .subscribe(stages => {

                this.stages = stages.map(s => {
                    s.not_in_kanban = s.not_in_kanban == 1 ? 1 : 0;
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
        const custom = this.backend.getRequest(`configuration/configurator/entries/spicebeancustomguidestages_checks`);
        const global = this.backend.getRequest(`configuration/configurator/entries/spicebeanguidestages_checks`);
        forkJoin([custom, global])
            .pipe(map(([c, g]) => [...c.map(i => ({...i, scope: 'custom'})), ...g.map(i => ({...i, scope: 'global'}))]))
            .subscribe(checks => {
                this.checks = checks;
            });
    }

    /**
     *
     */
    public save() {

        const requests: Observable<any>[] = [];

        if (this.changeService.hasChanges('stages')) {
            const changes = this.prepareSaveRequest('stages');
            if (changes.custom.length > 0 ) {
                requests.push(this.backend.postRequest(`configuration/configurator/spicebeancustomguidestages`, null, {config: changes.custom}));
            }
            if (changes.global.length > 0 ) {
                requests.push(this.backend.postRequest(`configuration/configurator/spicebeanguidestages`, null, {config: changes.global}));
            }
        }

        if (this.changeService.hasChanges('checks')) {
            const changes = this.prepareSaveRequest('checks');
            if (changes.custom.length > 0) {
                requests.push(this.backend.postRequest(`configuration/configurator/spicebeancustomguidestages_checks`, null, {config: changes.custom}));
            }

            if (changes.global.length > 0) {
                requests.push(this.backend.postRequest(`configuration/configurator/spicebeanguidestages_checks`, null, {config: changes.global}));
            }
        }

        if (this.changeService.hasChanges('spiceTexts')) {
            const changes = this.changeService.getAllChanges('spiceTexts');
            requests.push(this.backend.postRequest(`configuration/configurator/spicetexts`, null, {config: changes}));
        }

        forkJoin(requests).subscribe(() => {
            this.toast.sendToast('LBL_DATA_SAVED', 'success');
            if (this.changeService.hasChanges('stages')) {
                this.changeService.applyChanges(this.stages, 'stages');
            }
            if (this.changeService.hasChanges('checks')) {
                this.changeService.applyChanges(this.checks, 'checks');
                this.setCurrentChecks();
            }
            if (this.changeService.hasChanges('spiceTexts')) {
                this.changeService.applyChanges(this.spiceTexts, 'spiceTexts');
            }
        });
    }

    /**
     * prepare save request
     * @private
     * @param key
     */
    private prepareSaveRequest(key: 'checks' | 'stages' | 'spiceTexts') {
        const changes = this.changeService.getAllChanges(key);

        return {
            custom: changes.filter(c => c.scope == 'custom').map(c => window._.omit(c, ['scope'])),
            global: changes.filter(c => c.scope == 'global').map(c => window._.omit(c, ['scope']))
        };
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
