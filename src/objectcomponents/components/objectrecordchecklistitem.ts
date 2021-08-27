/**
 * @module ObjectComponents
 */
import {Component, Input} from '@angular/core';
import {model} from '../../services/model.service';
import {modelutilities} from '../../services/modelutilities.service';
import {view} from '../../services/view.service';
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-checklist-item',
    templateUrl: './src/objectcomponents/templates/objectrecordchecklistitem.html',
    providers: [view]
})
export class ObjectRecordChecklistItem {

    @Input() checkitem: any = {};
    @Input() checkfield: string = '';

    private checkid: string = '';


    constructor(private view: view, private model: model, private modelutilities: modelutilities, private language: language, private backend: backend) {
        this.checkid = this.modelutilities.generateGuid();
    }

    get checked() {
        try {
            let values = JSON.parse(this.model.data[this.checkfield]);
            return values[this.checkitem.item];
        } catch (e) {
            return false;
        }
    }

    checkItem(event) {
        let values = {};
        try {
            values = JSON.parse(this.model.data[this.checkfield]);
        } catch (e) {
        }

        values[this.checkitem.item] = event.target.checked;
        this.model.data[this.checkfield] = JSON.stringify(values);

        // update the backend
        if (event.target.checked)
            this.backend.postRequest('module/' + this.model.module + '/' + this.model.id + '/checklist/' + this.checkfield + '/' + this.checkitem.item);
        else
            this.backend.deleteRequest('module/' + this.model.module + '/' + this.model.id + '/checklist/' + this.checkfield + '/' + this.checkitem.item);
    }

    get disabled(){
        return !this.model.checkAccess('edit') || this.model.isEditing || this.model.isLoading;
    }

}