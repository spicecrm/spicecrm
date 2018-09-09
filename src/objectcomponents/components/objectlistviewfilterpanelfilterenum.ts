import {Component, Input, ViewChild, ViewContainerRef, ElementRef, OnInit, AfterViewInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-filter-panel-filter-enum',
    templateUrl: './app/objectcomponents/templates/objectlistviewfilterpanelfilterenum.html'
})
export class ObjectListViewFilterPanelFilterEnum implements OnInit {
    @Input() filter: any = {};

    operators: Array<any> = [
        {
            operator: 'equals',
            name: 'LBL_EQUALS'
        }, {
            operator: 'oneof',
            name: 'LBL_ONEOF'
        }, {
            operator: 'empty',
            name: 'LBL_EMPTY'
        }
    ];

    options: Array<any> = [];

    constructor(private elementRef: ElementRef, private metadata: metadata, private language: language, private model: model) {

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
        return this.filter.operator ? false : true;
    }

    get multiple() {
        return this.filter.operator == 'oneof';
    }

}
