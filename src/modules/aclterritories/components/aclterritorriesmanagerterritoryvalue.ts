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


@Component({
    selector: 'aclterritorries-manager-territory-value',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritoryvalue.html'
})
export class ACLTerritorriesManagerTerritoryValue {

    @Input() private element: any = {};
    @Input() private elementValues: any[] = [];
    @Input() private editable: boolean = true;

    constructor(private model: model, private view: view, private language: language) {
    }

    get elementValue() {
        return this.model.data.elementvalues[this.element.id] ? this.model.data.elementvalues[this.element.id].elementvalue : '';
    }

    set elementValue(value) {
        this.model.data.elementvalues[this.element.id].elementvalue = value;
    }

    get editing() {
        return this.view.isEditMode() && this.editable;
    }
}