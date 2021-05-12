/**
 * @module ObjectFields
 */
import {Component, Input, Optional} from '@angular/core';
import {model} from '../../services/model.service';
import {navigationtab} from '../../services/navigationtab.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

/**
 * a generic container for a field to be displayed
 */
@Component({
    selector: 'field-generic-display',
    templateUrl: './src/objectfields/templates/fieldgenericdisplay.html'
})
export class fieldGenericDisplay {
    // @Input() public value: string = '';
    /**
     * determines if the field is editbale and thus the edit pen is displayed
     */
    @Input() public editable: boolean = false;

    /**
     * hand over the fieldconfig
     */
    @Input() public fieldconfig: any = {};

    /**
     * an optional class or string of classes that is applied to the field wrapper
     */
    @Input() public fielddisplayclass: string = '';

    /**
     * the id of the field. This needs to be passed in
     */
    @Input() public fieldid: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        @Optional() private navigationtab: navigationtab
    ) {
    }

    /**
     * simple getter to check if we are in editmore
     */
    public isEditMode() {
        if (this.view.isEditMode() && this.editable) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * simple getter to determine if the field has a link, the view allows for links and if the user has ACL rights to navigate to thte the of the record
     */
    get link() {
        try {
            return this.fieldconfig.link && this.model.checkAccess('detail');
        } catch (e) {
            return false;
        }
    }

    /**
     * sets the model and the viewinto edit mode
     */
    public setEditMode() {
        if (this.editable) {
            this.model.startEdit();
            this.view.setEditMode(this.fieldid);
        }
    }

    /**
     * navigates from teh linkto the record
     */
    public goRecord() {
        if (this.link) {
            this.model.goDetail(this.navigationtab?.tabid);
        }
    }

    /*
    public onClick() {
        if(this.editable && !this.isEditMode()) {
            this.setEditMode();
        }
    }
    */

}

