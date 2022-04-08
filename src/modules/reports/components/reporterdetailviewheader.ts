/**
 * @module ModuleReports
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {ObjectPageHeader} from "../../../objectcomponents/components/objectpageheader";

@Component({
    selector: 'reporter-detail-view-header',
    templateUrl: '../templates/reporterdetailviewheader.html'
})
export class ReporterDetailViewHeader extends ObjectPageHeader {

    @Input() public whereConditions: any = {};
    @Input() public integrationParams: any = {};

    @Output() public showFilters = new EventEmitter<boolean>();

    constructor(public language: language,
                public metadata: metadata,
                public model: model,
                public router: Router) {
        super(language, router, model, metadata);
    }

    /*
     * emit boolean for the filter panel handling
     */
    public toggleFilters(event: boolean) {
        this.showFilters.emit(event);
    }
}
