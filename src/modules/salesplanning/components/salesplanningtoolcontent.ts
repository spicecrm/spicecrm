/**
 * @module ModuleSalesPlanning
 */
import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {SalesPlanningService} from "../services/salesplanning.service";
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {toast} from "../../../services/toast.service";

declare var moment: any;

@Component({
    selector: 'sales-planning-tool-content',
    templateUrl: './src/modules/salesplanning/templates/salesplanningtoolcontent.html',
    providers: [view]
})

export class SalesPlanningToolContent implements OnChanges, OnDestroy {

    public nodeContentArray: any[] = [];
    public periods: any[] = [];
    public languageSubscriber: any = {};
    public units: any = {
        days: 'd',
        weeks: 'w',
        months: 'M',
        quarters: 'Q',
        years: 'Y'
    };
    private planningNodeId: string;
    private nodeItemName: string = '';
    private isLoading: boolean = false;
    @Input() private node: any;

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private view: view,
                private toast: toast,
                private metadata: metadata,
                private planningService: SalesPlanningService) {
        this.subscribeToLanguage();
    }

    get isEditMode() {
        return this.view.isEditMode();
    }


    get editable() {
        return true || this.metadata.checkModuleAcl('SalesPlanningContentFields', 'edit');
    }

    public ngOnChanges() {
        this.setViewMode();
        this.buildPeriods();
        this.getNodeItemName();
    }

    public ngOnDestroy() {
        this.languageSubscriber.unsubscribe();
    }

    private subscribeToLanguage() {
        this.languageSubscriber = this.language.currentlanguage$.subscribe(() => this.buildPeriods());
    }

    private buildPeriods() {

        this.periods = [];
        let unit = this.model.getField('periode_unit');
        let segments = this.model.getField('periode_segments');
        let dateStart = this.model.getField('date_start');

        if (segments && !isNaN(segments) && unit && this.units[unit]) {
            let formats: any = {
                days: 'E',
                weeks: 'dddd',
                months: 'MMMM',
                quarters: 'Q',
                years: 'YYYY'
            };
            let lang = this.language.currentlanguage.substring(0, 2);
            moment.locale(lang);
            let date = new moment(dateStart);
            let i = 0;
            while (i < +segments) {
                this.periods.push({
                    key: `data_${unit}_p${i + 1}`,
                    name: date.format(formats[unit])
                });
                date.add(1, this.units[unit]);
                i++;
            }
        }
    }

    private getNodeItemName() {
        this.nodeItemName = '';
        this.planningNodeId = undefined;
        if (!this.node) return;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningNodes/version/${this.planningService.versionId}/NodeInfo`, params)
            .subscribe(nodeInfo => {
                if (nodeInfo && nodeInfo.planningNode) {
                    this.nodeItemName = nodeInfo.nodeText;
                    this.planningNodeId = nodeInfo.planningNode;
                    this.getNodeContent();
                }
            });
    }

    private getNodeContent() {
        this.nodeContentArray = [];
        if (!this.node) return;
        this.isLoading = true;
        let params = {
            nodes: this.planningService.selectedNodes,
            characteristics: this.planningService.selectedCharacteristics,
        };
        this.backend.getRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.planningNodeId}/Content`, params)
            .subscribe(nodeContent => {
                if (nodeContent && nodeContent.data) {
                    this.nodeContentArray = nodeContent.data;
                    if (!this.nodeContentArray[0].hasOwnProperty('sum')) {
                        this.nodeContentArray = this.nodeContentArray.map(item => {
                            item.sum = 0;
                            return item;
                        });
                    }
                    this.isLoading = false;
                }
            });
    }

    private setEditMode() {
        this.view.setEditMode();
    }

    private setViewMode() {
        this.view.setViewMode();
    }

    private save() {
        let body = {data: this.nodeContentArray};
        this.backend.postRequest(`module/SalesPlanningContents/version/${this.planningService.versionId}/Node/${this.planningNodeId}/Update`, {}, body)
            .subscribe(result => {
                if (result.success == true) {
                    this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED") + ".", "success");
                    this.setViewMode();
                }
            });
    }

    private cancel() {
        this.setViewMode();
    }

    private trackByFn(index, item) {
        return item.id;
    }
}
