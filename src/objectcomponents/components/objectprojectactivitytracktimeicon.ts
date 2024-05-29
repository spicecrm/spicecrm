/**
 * @module ObjectComponents
 */
import {Component, Injector} from '@angular/core';
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";

/**
 * opens ProjectActivityTrackTimeModal
 */
@Component({
    selector: 'object-project-activity-track-time-icon',
    templateUrl: '../templates/objectprojectactivitytracktimeicon.html'
})

export class ObjectProjectActivityTrackTimeIcon {

    constructor(
        private model: model,
        private modal: modal,
        public language: language,
        private injector: Injector
    ) {
    }


    /**
     * open ProjectActivityTrackTimeModal
     */
    public addProjectActivity() {

        // do nothing if Bean is being edited
        if (this.model.isEditing) return;
        this.modal.openModal('ProjectActivityTrackTimeModal', true, this.injector);
    }
}