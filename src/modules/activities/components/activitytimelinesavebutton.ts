/**
 * @module ModuleActivities
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {ObjectActionSaveButton} from "../../../objectcomponents/components/objectactionsavebutton";

@Component({
    selector: 'activity-timeline-save-button',
    templateUrl: '../templates/activitytimelinesavebutton.html'
})
export class ActivityTimelineSaveButton {

    /**
     * holds the action config
     */
    public actionconfig: any = {};

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    public parent: any = {};
    public module: string = '';

    /**
     * indicates that the model is saving
     */
    public saving: boolean = false;

    constructor(public language: language, public metadata: metadata, public model: model, public view: view) {

    }

    /**
     * getter for th elabel allows setting the display label via the actionconfig in the actionset
     */
    get buttonLabel() {
        return this.actionconfig.label ? this.actionconfig.label : 'LBL_SAVE';
    }

    public execute() {
        if (this.saving) return;

        if (this.model.validate()) {
            this.saving = true;
            this.model.save(true).subscribe(saved => {
                this.actionemitter.emit('save');
                this.model.endEdit();
            });
        }
    }

}
