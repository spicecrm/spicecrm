/**
 * @module WorkbenchModule
 */
import {
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

import {Subject} from 'rxjs';

@Component({
    selector: 'fieldsetmanager-fieldset-details',
    templateUrl: './src/workbench/templates/fieldsetmanagerfieldsetdetails.html',
    providers: [view]
})
export class FieldsetManagerFieldsetDetails implements OnChanges {

    @Input() fieldset: any = {};

    currentFieldSet: any = {};
    currentFieldSetConfig: any = {};

    constructor(private backend: backend, private metadata: metadata, private language: language, private view: view) {

    }

    ngOnChanges(changes: SimpleChanges){
        if(this.fieldset.isViewMode) {
            this.view.setViewMode();
        }else{
            this.view.setEditMode();
        }

        try {
            let currentFieldsetItem;
            this.metadata.getFieldSetItems(this.fieldset.fieldset).some(item => {
                if(item.id == this.fieldset.id){
                    this.currentFieldSet = this.metadata.getFieldset(item.fieldset);
                    this.currentFieldSetConfig = item.fieldconfig;
                    return true;
                }
            })

        } catch(e){
            this.currentFieldSet = {};
        }
    }

    get fieldsetname(){
        try {
            let currentFieldsetItem;
            this.metadata.getFieldSetItems(this.fieldset.fieldset).some(fieldset => {
                if(fieldset.id == this.fieldset.id){
                    currentFieldsetItem = fieldset;
                    return true;
                }
            })
            return this.metadata.getFieldsetName(currentFieldsetItem.fieldset)
        } catch(e){
            return '';
        }
    }

    set fieldsetname(value){

    }
}
