import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {popup} from '../../services/popup.service';

@Component({
    selector: 'object-merge-modal-records',
    templateUrl: './app/objectcomponents/templates/objectmergemodalrecords.html',
    providers: [view]
})
export class ObjectMergeModalRecords {

    listFields: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private model: model, private modellist: modellist) {
        let componentconfig = this.metadata.getComponentConfig('ObjectMergeModalRecords', this.model.module);
        let allFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
        for (let listField of allFields) {
            if (listField.fieldconfig.default !== false)
                this.listFields.push(listField);
        }
    }

    disableSelect(data) {
        if (data.id == this.model.id)
            return true;
        else
            return false;
    }

}