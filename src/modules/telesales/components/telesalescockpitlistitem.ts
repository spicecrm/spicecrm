/**
 * @module ModuleTeleSales
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {telecockpitservice} from '../services/telecockpit.service';

declare var moment;

@Component({
    selector: 'tele-sales-cockpit-list-item',
    templateUrl: '../templates/telesalescockpitlistitem.html',
    providers: [model, view]
})
export class TeleSalesCockpitListItem implements OnInit {

    @Input() public item: any = {};
    public componentFields: any[] = [];
    public isSelected: boolean = false;

    constructor(public language: language,
                public model: model,
                public view: view,
                public metadata: metadata,
                public telecockpitservice: telecockpitservice,
                public userpreferences: userpreferences
    ) {

        this.view.displayLabels = false;
    }

    get activityDate() {
        return this.userpreferences.formatDateTime(moment(this.item.planned_activity_date))
    }

    get hitsStyle() {
        return {
            'border-radius': '50%',
            'padding': this.item.hits.length > 1 ? '5px 5px 5px 3px' : '5px',
            'line-height': this.item.hits.length > 1 ? '80%' : '60%',
            'display': 'inline-block',
            'border': 'none'
        };
    }

    get selectedClass() {
        return this.isSelected ? 'slds-theme--shade' : '';
    }

    public ngOnInit() {
        this.initializeModel();
        this.loadComponentFields();
    }

    public initializeModel() {
        this.model.module = this.item.target_type;
        this.model.id = this.item.id;
        this.model.setData(this.item.data);
    }

    public loadComponentFields() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitListItem', this.model.module);
        this.componentFields = componentConf && componentConf.fieldset ? this.metadata.getFieldSetFields(componentConf.fieldset) : [];
    }

    public setSelectedListItem() {
        this.telecockpitservice.selectedListItem$ = this.item;
    }

    public trackByFn(index, item) {
        return item.item_id;
    }
}
