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

import {Router}   from '@angular/router';

import {metadata} from '../../../services/metadata.service';
import {footer} from '../../../services/footer.service';

@Component({
    selector: 'reporter-field-container',
    templateUrl: './src/modules/reports/templates/reporterfieldcontainer.html'
})
export class ReporterFieldContainer implements OnInit{

    @ViewChild('reportFieldContainer', {read: ViewContainerRef, static: true}) reportFieldContainer: ViewContainerRef;

    @Input() record: any = {};
    @Input() field: any = {};

    showPopoverTimeout: any = {};

    constructor(private metadata: metadata, private router: Router, private footer: footer, private elementRef: ElementRef) {

    }

    ngOnInit(){
        let fieldType = 'ReporterFieldStandard';

        if(this.field.component){
            fieldType = this.field.component;
        } else {
            switch (this.field.type) {
                case 'currency':
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
            componentRef.instance['record'] = this.record;
            componentRef.instance['field'] = this.field;
        })

    }

    get hasLink(){
        return this.field.link == 'yes';
    }

    followLink(){
        if(this.hasLink) {

            // if we have a popover destory it
            if (this.showPopoverTimeout) window.clearTimeout(this.showPopoverTimeout);
            this.destroyPopover()

            // route to the proper module
            if(this.field.linkinfo && this.field.linkinfo.root){
                this.router.navigate(['/module/' + this.field.linkinfo.root.module + '/' + this.record[this.field.linkinfo.root.idfield]]);
            } else {
                this.router.navigate(['/module/' + this.record.sugarRecordModule + '/' + this.record.sugarRecordId]);
            }
        }
    }

    /*
     * for the popover
     */

    popoverCmp: any = null;

    onMouseOver() {
        if(this.hasLink) {
            this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
        }
    }

    onMouseOut() {
        if(this.hasLink) {
            if (this.showPopoverTimeout) window.clearTimeout(this.showPopoverTimeout);
            this.destroyPopover()
        }
    }

    renderPopover(){
        this.metadata.addComponent('fieldModelFooterPopover', this.footer.footercontainer).subscribe(popover => {
            // set the module and ID
            if(this.field.linkinfo && this.field.linkinfo.root){
                popover.instance['popovermodule'] = this.field.linkinfo.root.module;
                popover.instance['popoverid'] = this.record[this.field.linkinfo.root.idfield];
            } else {
                popover.instance['popovermodule'] = this.record.sugarRecordModule;
                popover.instance['popoverid'] = this.record.sugarRecordId;
            }

            // set the rest of the data
            popover.instance['parentElementRef'] = this.elementRef;
            popover.instance['self'] = popover;

            this.popoverCmp = popover;
        })
    }

    destroyPopover(){
        if(this.popoverCmp)
            this.popoverCmp.destroy();
    }

}