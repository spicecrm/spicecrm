/**
 * @module ModuleACLTerritories
 */
import {
    Component,
    Input
} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
 * part of the territories manager - renders one territorty value element
 */
@Component({
    selector: 'aclterritorries-manager-territory-value',
    templateUrl: '../templates/aclterritorriesmanagerterritoryvalue.html'
})
export class ACLTerritorriesManagerTerritoryValue {

    /**
     * the element itself
     */
    @Input() public element: any = {};

    /**
     * the element values
     * ToDo: join with the element object
     */
    @Input() public elementValues: any[] = [];

    /**
     * boolean if field shoudl be editable
     */
    @Input() public editable: boolean = true;

    constructor(public model: model, public view: view, public language: language) {
    }

    /**
     * getter for the element value
     */
    get elementValue() {
        return this.model.data.elementvalues[this.element.id] ? this.model.data.elementvalues[this.element.id].elementvalue : '';
    }

    /**
     * setter for the elementvalue
     * @param value
     */
    set elementValue(value) {
        this.model.data.elementvalues[this.element.id].elementvalue = value;
    }

    /**
     * simle getter to get if the view is editing
     */
    get editing() {
        return this.view.isEditMode() && this.editable;
    }
}
