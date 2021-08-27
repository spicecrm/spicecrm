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

    /**
     * the fieldset to be rendered
     *
     * @private
     */
    @Input() private fieldSet: string = '';

    /**
     * if the item should be collapsed
     *
     * @private
     */
    @Input() private collapsed: boolean = true;

    /**
     * the fields to be displayed
     *
     * @private
     */
    private fields: any[] = [];

    constructor(private metadata: metadata, private model: model, private view: view) {

    }

    /**
     * initialize and load the label length and the fields
     */
    public ngOnInit() {
        // set teh label length
        this.setLabelLength();

        // get the fields
        this.fields = this.getFields();
    }

    /**
     * loads the fields from the fieldset
     *
     * @private
     */
    private getFields() {
        let fieldsetFields = this.metadata.getFieldSetFields(this.fieldSet);

        if (this.model.data && this.model.data.acl_fieldcontrol) {
            let thisFieldsetFields = [];
            for (let fieldsetFieldIndex in fieldsetFields) {
                if (this.metadata.hasField(this.model.module, fieldsetFields[fieldsetFieldIndex].field)) {
                    if (!(this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] && this.model.data.acl_fieldcontrol[fieldsetFields[fieldsetFieldIndex].field] === '1')) {
                        thisFieldsetFields.push(fieldsetFields[fieldsetFieldIndex]);
                    }
                }
            }

            return thisFieldsetFields;
        }

        return fieldsetFields;
    }

    /**
     * checks if a field shoudl be displayed based on the model state
     *
     * @param field
     * @private
     */
    private displayField(field): boolean {
        if (field.fieldconfig?.requiredmodelstate) {
            return this.model.checkModelState(field.fieldconfig.requiredmodelstate);
        }

        return true;
    }

    /**
     * toggles the collapsed state
     */
    private toggleCollapsed() {
        this.collapsed = !this.collapsed;

        // set the view label length
        this.setLabelLength();
    }

    /**
     * gets the collapsed icon based on the state
     */
    get toggleIcon() {
        return this.collapsed ? 'chevrondown' : 'chevronup';
    }

    /**
     * short kabels if we are collapsed
     * @private
     */
    private setLabelLength() {
        if (this.collapsed) {
            this.view.displayLabels = false;
            this.view.labels = 'short';
        } else {
            this.view.displayLabels = true;
            this.view.labels = 'default';
        }
    }

    /**
     * determines if the label should be shown
     *
     * @param fieldConfig
     * @private
     */
    private showLabel(fieldConfig) {
        if (fieldConfig.hidelabel === true) {
            return false;
        } else {
            return true;
        }
    }

}
