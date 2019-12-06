/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-page-header-detail-row',
    templateUrl: './src/objectcomponents/templates/objectpageheaderdetailrow.html',
    providers: [view]
})
export class ObjectPageHeaderDetailRow implements OnInit {
    @Input() private fieldSet: string = '';
    @Input() private opacity: number = 1;
    @Input() private collapsed: boolean = true;

    constructor(private metadata: metadata, private model: model, private view: view) {

    }

    public ngOnInit() {
        this.setLabelLength();
    }

    private getFields() {
        let fieldsetFields = this.metadata.getFieldSetFields(this.fieldSet);


        if (this.model.data && this.model.data.acl_fieldcontrol) {
            let thisFieldsetFields = [];
            for (let fieldsetFieldIndex in fieldsetFields) {
                if ( this.metadata.hasField( this.model.module, fieldsetFields[fieldsetFieldIndex].field )) {
                    if( !(this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] && this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] === '1') ) {
                        thisFieldsetFields.push( fieldsetFields[fieldsetFieldIndex] );
                    }
                }
            }

            return thisFieldsetFields;
        }

        fieldsetFields.forEach( ( field, index ) => {
            if ( !this.metadata.hasField( this.model.module, field.field ) ) fieldsetFields.splice( index,1 );
        });
        return fieldsetFields;

    }

    private toggleCollapsed() {
        this.collapsed = !this.collapsed;

        // set the view label length
        this.setLabelLength();
    }

    get toggleIcon() {
        return this.collapsed ? 'chevrondown' : 'chevronup';
    }

    private setLabelLength() {
        if (this.collapsed) {
            this.view.displayLabels = false;
            this.view.labels = 'short';
        } else {
            this.view.displayLabels = true;
            this.view.labels = 'default';
        }
    }

    private showLabel(fieldConfig) {
        if (fieldConfig.hidelabel === true) {
            return false;
        } else {
            return true;
        }
    }

}
