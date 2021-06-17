/**
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {model} from "../../services/model.service";
import {view} from "../../services/view.service";
import {backend} from "../../services/backend.service";

@Component({
    selector: 'administration-job-methods',
    templateUrl: './src/admincomponents/templates/administrationjobmethods.html'
})
export class AdministrationJobMethods {

    constructor(public model: model,
                public view: view,
                public backend: backend) {
    }
}
