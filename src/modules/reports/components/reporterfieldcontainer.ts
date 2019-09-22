/**
 * @module ModuleReports
 */
import {
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ElementRef
} from '@angular/core';

import {Router} from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {footer} from '../../../services/footer.service';

@Component({
    selector: 'reporter-field-container',
    templateUrl: './src/modules/reports/templates/reporterfieldcontainer.html'
})
export class ReporterFieldContainer implements OnInit {

    @ViewChild('reportFieldContainer', {
        read: ViewContainerRef,
        static: true
    }) private reportFieldContainer: ViewContainerRef;

    @Input() private record: any = {};
    @Input() private field: any = {};

    private showPopoverTimeout: any = {};

    constructor(private metadata: metadata, private router: Router, private footer: footer, private elementRef: ElementRef) {

    }

    public ngOnInit() {
        let fieldType = 'ReporterFieldStandard';

        if (this.field.component) {
            fieldType = this.field.component;
        } else {
            switch (this.field.type) {
                case 'currency':
                    fieldType = 'ReporterFieldCurrency';
                    break;
                case 'currencyint':
                    fieldType = 'ReporterFieldCurrency';
                    break;
                case 'enum':
                    fieldType = 'ReporterFieldEnum';
                    break;
                case 'date':
                    fieldType = 'ReporterFieldDate';
                    break;
                default:
                    fieldType = 'ReporterFieldStandard';
                    break;
            }
        }

        this.metadata.addComponent(fieldType, this.reportFieldContainer).subscribe(componentRef => {
            componentRef.instance.record = this.record;
            componentRef.instance.field = this.field;
        });

    }

    get hasLink() {
        return this.field.link == 'yes';
    }

    get recordModule() {
        if (this.hasLink) {
            // route to the proper module
            if (this.field.linkinfo && this.field.linkinfo.root) {
                return this.field.linkinfo.root.module;
            } else {
                return this.record.sugarRecordModule;
            }
        } else {
            return '';
        }
    }

    get recordId() {
        if (this.hasLink) {
            // route to the proper module
            if (this.field.linkinfo && this.field.linkinfo.root) {
                return this.record[this.field.linkinfo.root.idfield];
            } else {
                return this.record.sugarRecordId;
            }
        } else {
            return '';
        }
    }

    private followLink() {
        if (this.hasLink) {
            // route to the proper module
            if (this.field.linkinfo && this.field.linkinfo.root) {
                this.router.navigate(['/module/' + this.field.linkinfo.root.module + '/' + this.record[this.field.linkinfo.root.idfield]]);
            } else {
                this.router.navigate(['/module/' + this.record.sugarRecordModule + '/' + this.record.sugarRecordId]);
            }
        }
    }
}
