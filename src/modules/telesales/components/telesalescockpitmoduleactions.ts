/**
 * @module ModuleTeleSales
 */
import {Component, Input, OnChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';

@Component({
    selector: 'tele_sales_cockpit_module_actions',
    templateUrl: './src/modules/telesales/templates/telesalescockpitmoduleactions.html',
})
export class TeleSalesCockpitModuleActions implements OnChanges {

    @ViewChild('moduleactionscontainer', {read: ViewContainerRef}) private moduleactionscontainer: ViewContainerRef;
    @Input() private module: string;

    private actionset: string = '';

    constructor(private language: language,
                private model: model,
                private metadata: metadata,
    ) {
    }

    ngOnChanges() {
        if (this.module) {
            this.loadActionset(this.module);
        }
    }

    loadActionset(module) {
        let conf = this.metadata.getComponentConfig('TeleSalesCockpitModuleActions', module);
        this.actionset = conf && conf.actionset ? conf.actionset : '';
    }
}
