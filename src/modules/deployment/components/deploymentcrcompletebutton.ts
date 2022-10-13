/**
 * @module ModuleDeployment
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {broadcast} from '../../../services/broadcast.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {Subscription} from "rxjs";

/**
 * renders a button in an actionset that can activate a CR in the system
 */
@Component({
    templateUrl: '../templates/deploymentcrcompletebutton.html'
})
export class DeploymentCRCompleteButton {

    constructor(public language: language, public backend: backend, public model: model, public toast: toast, public broadcast: broadcast) {

    }

    /**
     * deactivate the change request and complete
     */
    public execute() {
        this.backend.deleteRequest('module/SystemDeploymentCRs/active').subscribe(() => {
            this.broadcast.broadcastMessage('cr.clearactive', {
                module: this.model.module,
            });

            this.model.startEdit(true, false);
            this.model.setField('crstatus', '4');
            if (this.model.validate()) {
                this.model.save();
            } else {
                this.model.edit();
            }
        });
    }
}
