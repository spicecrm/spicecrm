/**
 * @module ModuleTeleSales
 */
import {Component, Input, OnChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'tele-sales-cockpit-module-actions',
    templateUrl: '../templates/telesalescockpitmoduleactions.html',
})
export class TeleSalesCockpitModuleActions implements OnChanges {

    @ViewChild('moduleactionscontainer', {read: ViewContainerRef, static: true}) public moduleactionscontainer: ViewContainerRef;
    @Input() public module: string;

    public actionset: string = '';

    constructor(public language: language, public metadata: metadata) {
    }

    public ngOnChanges() {
        if (this.module) {
            this.loadActionset(this.module);
        }
    }

    public loadActionset(module) {
        let conf = this.metadata.getComponentConfig('TeleSalesCockpitModuleActions', module);
        this.actionset = conf && conf.actionset ? conf.actionset : '';
    }
}
