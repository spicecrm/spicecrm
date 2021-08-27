/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";
import {relatedmodels} from "../../services/relatedmodels.service";

@Component({
    selector: 'object-action-save-related-button',
    templateUrl: './src/objectcomponents/templates/objectactionsaverelatedbutton.html'
})
export class ObjectActionSaveRelatedButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    public module: string = '';

    private saving: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private relatedmodels: relatedmodels) {

    }

    /*
    * @return boolean
    */
    get hidden() {
        return !this.view.isEditMode();
    }

    /*
    * @set saving
    * @emit boolean by actionemitter
    * @setViewMode
    * @call relatedmodels.setItem
    * @call model.endEdit
    * @setEditMode
    */
    public execute() {
        if (this.saving) return;
        if (this.model.validate()) {
            this.saving = true;
            // get changed Data
            let changedData: any = this.model.getDirtyFields();

            // in any case update date modified and set the id for the PUT
            changedData.date_modified = this.model.getField('date_modified');
            changedData.id = this.model.id;

            // save related model
            this.actionemitter.emit(true);

            // set to view mode and save bean
            this.view.setViewMode();
            this.relatedmodels.setItem(changedData).subscribe(success => {
                // end editing
                this.model.endEdit();
                this.saving = false;
            }, error => {
                // return to edit mode
                this.view.setEditMode();
                this.saving = false;
            });
        } else {
            this.saving = false;
            this.model.edit().subscribe(res => {
                if (!res) {
                    this.model.cancelEdit();
                    this.view.setViewMode();
                } else {
                    this.execute();
                }
            });
        }
    }

}
