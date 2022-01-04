/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";
import {metadata} from "../../services/metadata.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modellist} from "../../services/modellist.service";

@Component({
    selector: 'administration-job-cockpit',
    templateUrl: '../templates/administrationjobcockpit.html'
})
export class AdministrationJobCockpit {

    constructor(public model: model,
                public modelList: modellist) {
    }
}
