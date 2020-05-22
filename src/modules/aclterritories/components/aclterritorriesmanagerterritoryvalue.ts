/**
 * @module ModuleACLTerritories
 */
import {
    Component,
    OnChanges,
    Input
} from '@angular/core';
import {modal} from '../../../services/modal.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {modelutilities} from '../../../services/modelutilities.service';

/**
 * part of the territories manager - renders one territorty value element
 */
@Component({
    selector: 'aclterritorries-manager-territory-value',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritoryvalue.html'
})
export class ACLTerritorriesManagerTerritoryValue {

    /**
     * the element itself
     */
    @Input() private element: any = {};

    /**
     * the element values
     * ToDo: join with the element object
     */
    @Input() private elementValues: any[] = [];

    /**
     * boolean if field shoudl be editable
     */
    @Input() private editable: boolean = true;

    constructor(private model: model, private view: view, private language: language) {
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
