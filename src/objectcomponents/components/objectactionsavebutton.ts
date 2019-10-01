/**
 * @module ObjectComponents
 */
import {Component,  EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-action-save-button',
    templateUrl: './src/objectcomponents/templates/objectactionsavebutton.html'
})
export class ObjectActionSaveButton {

    @Output() public  actionemitter: EventEmitter<any> = new EventEmitter<any>();

    public parent: any = {};
    public module: string = '';

    private saving: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view) {

    }

    get hidden() {
        return !this.view.isEditMode();
    }

    public execute() {
        if(this.saving) return;

        if(this.model.validate()) {
            this.saving = true;
            this.model.save().subscribe(saved => {
                this.actionemitter.emit('save');
                this.model.endEdit();
                this.view.setViewMode();
            });
        }
    }

}
