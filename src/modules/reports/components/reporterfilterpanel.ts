/**
 * @module ModuleReports
 */
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

import {reporterconfig} from '../services/reporterconfig';
import {animate, style, transition, trigger} from "@angular/animations";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {session} from "../../../services/session.service";

const REPORTERFILTERPANELANIMATIONS = [
    trigger('animatepopover', [
        transition(':enter', [
            style({opacity: 0}),
            animate('.25s', style({opacity: 1}))
        ]),
        transition(':leave', [
            style({opacity: '1'}),
            animate('.25s', style({opacity: 0}))
        ])
    ])
];

/**
 * renders a panel with the dynamic filters for a report
 */
@Component({
    selector: 'reporter-filter-panel',
    templateUrl: '../templates/reporterfilterpanel.html',
    animations: REPORTERFILTERPANELANIMATIONS
})
export class ReporterFilterPanel {
    @ViewChild('popover', {read: ViewContainerRef, static: true}) public popover: ViewContainerRef;
    @ViewChild('savedFiltersContainer', {static: false}) public savedFiltersComponent;

    /**
     * an event emitter that emits when the filter is applied
     */
    @Output() public filterapplied: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the integration params
     */
    @Input() public integrationparams: any = {};

    public selectedFilterId: any;
    public showPopover: boolean = false;
    public filter: any = {};

    constructor(public model: model,
                public language: language,
                public elementRef: ElementRef,
                public toast: toast,
                public backend: backend,
                public session: session,
                public reporterconfig: reporterconfig) {

    }

    /**
     * @return isAdmin: boolean
     */
    get isAdmin() {
        return !!this.session.authData.admin;
    }

    /**
     * @return whereConditions: object[]
     */
    get whereConditions() {
        return this.reporterconfig.userFilters;
    }

    /**
     * positions the popover properly
     */
    get popoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let popRect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ((rect.height - popRect.height) / 2)) + 'px',
            left: (rect.left - popRect.width) + 'px'
        };
    }

    /**
     * checks if the plugin to save filters is enabled for the report
     */
    get displaySavedFilters() {
        return !!this.integrationparams.activePlugins && !!this.integrationparams.activePlugins.ksavedfilters;
    }

    /**
     * open new filter data popover
     */
    public openPopover() {
        this.showPopover = true;
        this.initializeFilter();
    }

    /**
     * close popover and initialize new filter
     */
    public closePopover() {
        this.showPopover = false;
        this.initializeFilter();
    }

    /**
     * initialize new filter
     */
    public initializeFilter() {
        this.filter = {
            savedfilter_id: this.model.generateGuid(),
            name: '',
            isNew: true,
            is_global: false
        };
    }

    /**
     * when the filter is to be applied
     */
    public applyFilter() {
        this.filterapplied.emit(true);
        this.reporterconfig.refresh();
    }

    /**
     * @param filterId
     */
    public setSelectedFilterId(filterId) {
        this.selectedFilterId = filterId;
    }

    /**
     * save the filter changes or create and save a new filter
     */
    public handleSave() {

        if (!this.selectedFilterId) {
            return this.openPopover();
        } else {
            this.saveFilter(this.selectedFilterId);
        }
    }

    /**
     * save the new filter to the database
     * call child methods to update the savedFilters array
     * @param id: string
     * @param newFilter: object
     */
    public saveFilter(id, newFilter?) {
        let data = {
            selectedfilters: {...this.reporterconfig.userFilters}
        };

        if (data) {
            data = {...newFilter, ...data};
        }

        this.backend.postRequest(`module/KReports/${this.model.id}/savedfilter/${id}`, [], data)
            .subscribe(res => {
                if (!!res && !!res.success) {
                    this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
                    if (!!this.savedFiltersComponent) {
                        if (!!newFilter) {
                            this.savedFiltersComponent.pushNewFilter(data);
                        } else {
                            this.savedFiltersComponent.updateFilterData();
                        }
                    }
                } else {
                    this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
                }
            });
    }

    /**
     * open popover to fill in new filter data
     */
    public saveFilterAs() {
        if (!this.selectedFilterId) return;
        this.openPopover();
    }

    /**
     * reset selectedFilterId and save the new filter
     * close the popover
     */
    public confirmSave() {
        this.selectedFilterId = undefined;
        this.saveFilter(this.filter.savedfilter_id, this.filter);
        this.closePopover();
    }

}
