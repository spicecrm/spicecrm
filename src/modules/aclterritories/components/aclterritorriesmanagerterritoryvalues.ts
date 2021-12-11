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
 * part of the territories manager - renders the territory values as part of the territory detail
 */
@Component({
    selector: 'aclterritorries-manager-territory-values',
    templateUrl: '../templates/aclterritorriesmanagerterritoryvalues.html'
})
export class ACLTerritorriesManagerTerritoryValues implements OnChanges{

    /**
     * the territory detail definitions
     */
    @Input() public territorrytypedetails: any = {};

    /**
     * define if this is editable or not
     */
    @Input() public editable: boolean = true;

    constructor(public backend: backend, public modal: modal, public model: model, public view: view, public language: language, public modelutilities: modelutilities) {
    }


    public ngOnChanges(): void {
        for(let element of this.territorrytypedetails.elements){
            if(!this.model.data.elementvalues[element.id]) this.model.data.elementvalues[element.id] = '';
        }
    }

    /**
     * returns the elkementvalues for a given element
     * @param elementId
     */
    public elementValues(elementId) {
        let retValues = [];
        for (let elementvalue of this.territorrytypedetails.elementvalues) {
            if (elementvalue.spiceaclterritoryelement_id == elementId) {
                retValues.push(elementvalue);
            }
        }
        return retValues;
    }
}
