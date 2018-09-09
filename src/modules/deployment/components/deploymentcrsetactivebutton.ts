import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {broadcast} from '../../../services/broadcast.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';

@Component({
    templateUrl: './app/modules/deployment/templates/deploymentcrsetactivebutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '(click)': 'setActive()',
        '[style.display]': 'getDisplay()'
    },
    styles: [
        ':host >>> {cursor:pointer;}'
    ]
})
export class DeploymentCRSetActiveButton {

    activeID = '';

    constructor(private language: language, private backend: backend, private model: model, private toast: toast, private broadcast: broadcast) {
        this.backend.getRequest('systemdeploymentcrs/active').subscribe(crresponse => {
            this.activeID = crresponse.id;
        })
    }

    get isActive(){
        return this.model.id == this.activeID;
    }

    setActive() {
        this.backend.postRequest('systemdeploymentcrs/active/' + this.model.id).subscribe(status => {
            if (status.status == 'success') {
                this.activeID = this.model.id;

                this.broadcast.broadcastMessage('cr.setactive', {module: this.model.module, id: this.model.id, name: this.model.data.name});
            }
        })
    }

    getDisplay() {
        if(this.model.getFieldValue('crstatus') == '3')
            return 'none';

        return 'inherit';
    }
}