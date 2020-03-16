/**
 * @module ModuleEmails
 */

import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: "email-schedules-views",
    templateUrl: "./src/modules/emails/templates/emailschedulesview.html",
    providers: [modellist, view],
})

export class EmailSchedulesView {
    constructor(private language: language,
                private model: model,
                private view: view,
                private metadata: metadata,
                private modellist: modellist
    ) {
        this.modellist.module = 'EmailSchedules';
    }


    /**
     * get isLoading list property
     */
    get isloading() {
        return this.modellist.isLoading;
    }

    /**
     * track items
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }
}
