/**
 * @module ModuleActivities
 */
import {
    Component, Input,
    OnInit
} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {view} from '../../../services/view.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Router} from "@angular/router";

/**
 * renders a bar with quick add sysmbols to be rendered in the model popover
 */
@Component({
    templateUrl: '../templates/fieldactivitiestaskwithclosecheckbox.html',
})
export class fieldActivitiesTaskWithCloseCheckbox extends fieldGeneric {

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    /**
     * getter if the task can be set complete by the user
     */
    get canComplete() {
        if ((this.model.getField('status') === 'Completed' || this.model.getField('status') === 'Deferred') && this.model.checkAccess('edit')) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * getter
     */
    get completed() {
        return this.model.getField('status') == 'Completed';
    }

    /**
     * setter for the closed value to trigger the complete
     *
     * @param value
     */
    set completed(value){
        if(value && this.canComplete){
            this.model.startEdit();
            this.model.setField('status', 'Completed');
            this.model.save();
        }
    }


}
