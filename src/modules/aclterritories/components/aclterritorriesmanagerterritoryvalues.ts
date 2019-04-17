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
    selector: 'aclterritorries-manager-territory-values',
    templateUrl: './src/modules/aclterritories/templates/aclterritorriesmanagerterritoryvalues.html'
})
export class ACLTerritorriesManagerTerritoryValues{

    @Input() territorrytypedetails: any = {};
    @Input() editable: boolean = true;

    constructor(private backend: backend, private modal: modal, private model: model, private view: view, private language: language, private modelutilities: modelutilities) {
    }

    elementValues(elementId){
        let retValues = [];
        for(let elementvalue of this.territorrytypedetails.elementvalues){
            if(elementvalue.spiceaclterritoryelement_id == elementId)
                retValues.push(elementvalue);
        }
        return retValues;
    }

    get editing(){
        return this.view.isEditMode() && this.editable;
    }
}