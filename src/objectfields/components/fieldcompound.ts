/**
 * @module ObjectFields
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';
import {ObjectRecordFieldset} from '../../objectcomponents/components/objectrecordfieldset';

/**
 * renders a compound of fields / form elements
 */
@Component({
    selector: 'field-compound',
    templateUrl: '../templates/fieldcompound.html'
})
export class fieldCompound extends fieldGeneric implements OnInit {

    @ViewChild('compound', {read: ViewContainerRef, static: true}) public compound: ViewContainerRef;

    public ngOnInit() {
        super.ngOnInit();
        this.metadata.addComponent('ObjectRecordFieldset', this.compound ).subscribe(compound => {
           compound.instance.fieldset = this.fieldconfig.fieldset;
           compound.instance.direction = 'horizontal';
           compound.instance.fieldpadding = 'xxx-small';
       });
   }

   // copy from fieldLabel component (temporary solution)
    get label() {
        if (this.fieldconfig.label) {
            if (this.fieldconfig.label.indexOf(':') > 0) {
                let fielddetails = this.fieldconfig.label.split(':');
                return this.language.getLabel(fielddetails[1], fielddetails[0], this.view.labels);
            } else {
                return this.language.getLabel(this.fieldconfig.label, this.model.module, this.view.labels);
            }
        } else {
            return this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig, this.view.labels);
        }
    }

}
