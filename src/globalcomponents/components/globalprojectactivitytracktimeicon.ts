/**
 * @module GlobalComponents
 */
import {Component, Injector} from '@angular/core';
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {language} from "../../services/language.service";
import {ProjectActivityTrackTimeModal} from "../../modules/projects/components/projectactivitytracktimemodal";
import {view} from "../../services/view.service";
/**
 * opens ProjectActivityTrackTimeModal
 */
@Component({
    selector: 'global-project-activity-track-time-icon',
    templateUrl: '../templates/globalprojectactivitytracktimeicon.html',
    providers: [model, view]
})

export class GlobalProjectActivityTrackTimeIcon {

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
        this.modal.openStaticModal(ProjectActivityTrackTimeModal, true, this.injector);
    }
}