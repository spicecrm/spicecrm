/**
 * @module ModuleReports
 */
import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'reporter-filter-item-user',
    templateUrl: './src/modules/reports/templates/reporterfilteritemuser.html'
})
export class ReporterFilterItemUser implements OnInit {
    /**
     * whereCondition: object
     */
    @Input() private whereCondition: any = {};

    private fieldName: string;

    /**
     * @return isMultiSelect: boolean
     */
    get isMultiSelect(): boolean {
        switch (this.whereCondition.operator) {
            case 'oneof':
            case 'oneofnot':
            case 'oneofnotornull':
                return true;
            default:
                return false;
        }
    }

    /**
     * set the fieldName from path
     */
    public ngOnInit() {
        const pathArray = this.whereCondition.path.split('::');

        // the last entry has to be the field
        let fieldArray = pathArray[pathArray.length - 1].split(':');
        this.fieldName = fieldArray[1];
    }
}
