/**
 * @module ModuleACLTerritories
 */
import {
    Component, Input, Output, EventEmitter
} from '@angular/core';
import {language} from '../../../services/language.service';
import {modelutilities} from '../../../services/modelutilities.service';

@Component({
    templateUrl: './src/modules/aclterritories/templates/aclobjectsmanagerobjectterritoriesmodal.html'
})
export class ACLObjectsManagerObjectTerritoriesModal {

    self: any = {};
    @Input() availableValues: Array<any> = [];
    @Input() currentValues: Array<any> = [];
    @Output() setValues: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private modelutilities: modelutilities) {
    }

    close(){
        this.self.destroy();
    }

    isChecked(value){
        return this.currentValues.indexOf(value) >= 0;
    }

    checkValue(value, event){
        if(value == '*'){
            this.currentValues = ['*'];
        } else {
            let actIndex = this.currentValues.indexOf(value);
            if (actIndex >= 0) {
                this.currentValues.splice(actIndex, 1);
            } else {
                this.currentValues.push(value);
            }

            // delete the * value
            let allIndex = this.currentValues.indexOf('*');
            if (allIndex >= 0) {
                this.currentValues.splice(allIndex, 1);
            }
        }
        event.preventDefault();
    }

    save(){
        this.setValues.emit(this.currentValues);
        this.close();
    }

}