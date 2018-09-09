import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-filter-panel-filter-date',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfilterdate.html'
})
export class ObjectListViewFilterPanelFilterDate implements OnInit
{
    @Input() filter: any = {};
    // should be received from backend...
    readonly operators: any[] = [
        {
            operator: 'today',
            name: 'LBL_TODAY'
        },
        {
            operator: 'past',
            name: 'LBL_PAST'
        },
        {
            operator: 'future',
            name: 'LBL_FUTURE'
        },
        {
            operator: 'thismonth',
            name: 'LBL_THIS_MONTH'
        },
        {
            operator: 'thisquarter',
            name: 'LBL_THIS_QUARTER'
        },
        {
            operator: 'thisyear',
            name: 'LBL_THIS_YEAR'
        },
        {
            operator: 'nextmonth',
            name: 'LBL_NEXT_MONTH'
        },
        {
            operator: 'nextquarter',
            name: 'LBL_NEXT_QUARTER'
        },
        {
            operator: 'nextyear',
            name: 'LBL_NEXT_YEAR'
        }
    ];
    options: Array<any> = [];

    constructor(
        private language: language,
        private model: model
    ) {

    }

    ngOnInit() {
        let options = this.language.getFieldDisplayOptions(this.model.module, this.filter.field);
        for (let optionVal in options) {
            if (optionVal != '')
                this.options.push({
                    value: optionVal,
                    display: options[optionVal]
                })
        }
    }

    operatorDisabled() {
        return this.filter.field ? false : true;
    }


    valueDisabled() {
        return true;
        // return this.filter.operator ? false : true;
    }
}
