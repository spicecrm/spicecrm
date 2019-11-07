/**
 * @module ModuleReports
 */
import {
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {metadata} from '../../../services/metadata.service';

declare var _: any;

@Component({
    selector: 'reporter-field-container',
    templateUrl: './src/modules/reports/templates/reporterfieldcontainer.html'
})
export class ReporterFieldContainer implements AfterViewInit {

    @ViewChild('reportFieldContainer', {
        read: ViewContainerRef,
        static: false
    }) private reportFieldContainer: ViewContainerRef;

    @Input() private record: any = {};
    @Input() private value: any = {};
    @Input() private field: any = {};

    constructor(private metadata: metadata) {

    }

    public ngAfterViewInit() {
        let fieldType = 'ReporterFieldStandard';

        // if we have a value an no record ... create the record
        if (this.value && _.isEmpty(this.record)) {
            this.record = {};
            this.record[this.field.fieldid] = this.value;
            this.record[this.field.fieldid + '_val'] = this.value;
        }

        if (this.field.component) {
            fieldType = this.field.component;
        } else {
            switch (this.field.type) {
                case 'percentage':
                    fieldType = 'ReporterFieldPercentage';
                    break;
                case 'currency':
                    fieldType = 'ReporterFieldCurrency';
                    break;
                case 'currencyint':
                    fieldType = 'ReporterFieldCurrency';
                    break;
                case 'enum':
                    fieldType = 'ReporterFieldEnum';
                    break;
                case "datetimecombo":
                case "datetime":
                    fieldType = 'ReporterFieldDateTime';
                    break
                case 'date':
                    fieldType = 'ReporterFieldDate';
                    break;
                default:
                    fieldType = 'ReporterFieldStandard';
                    break;
            }
        }

        this.metadata.addComponentDirect(fieldType, this.reportFieldContainer).subscribe(componentRef => {
            componentRef.instance.record = this.record;
            componentRef.instance.field = this.field;
        });

    }


    get hasLink() {
        return this.field.link == 'yes';
    }

    get recordModule() {
        if (this.hasLink && this.record) {
            // route to the proper module
            if (this.field.linkinfo && this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root']) {
                return this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root'].module;
            } else {
                return this.record.sugarRecordModule;
            }
        } else {
            return '';
        }
    }

    get recordId() {
        if (this.hasLink && this.record) {
            // route to the proper module
            if (this.field.linkinfo && this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root']) {
                return this.record[this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root'].idfield];
            } else {
                return this.record.sugarRecordId;
            }
        } else {
            return '';
        }
    }
}
