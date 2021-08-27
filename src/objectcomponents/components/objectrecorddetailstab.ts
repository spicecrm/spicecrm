/**
 * @module ObjectComponents
 */

import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

/**
 * renders a tab item with a fieldset as part of the details view on a model
 *
 * in any case requires a component that provides a view and a model
 */
@Component({
    selector: 'object-record-details-tab',
    templateUrl: './src/objectcomponents/templates/objectrecorddetailstab.html'
})
export class ObjectRecordDetailsTab implements OnInit {

    /**
     * @ignore
     */
    private componentconfig: any = {};

    /**
     * defines if the panel is expanded or collapsed. Expanded by default
     */
    private expanded: boolean = true;

    constructor(private metadata: metadata, private model: model, private language: language) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }
    }

    /**
     * simple getter to get the fieldset id from teh componentconfig
     */
    get fieldSet() {
        try {
            return this.componentconfig.fieldset;
        } catch (e) {
            return '';
        }
    }

    /**
     * a simple getter for the componentconfig to determine if the label should be shown or hidden
     */
    get showTitle() {
        try {
            return !this.componentconfig.hidelabel;
        } catch (e) {
            return false;
        }
    }

    /**
     * determine if the panel as such is hidden
     *
     * this is mainly driven by the required model state
     */
    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }
}
