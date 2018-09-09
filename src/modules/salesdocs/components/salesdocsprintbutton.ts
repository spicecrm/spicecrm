import {Component, Input, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {session} from '../../../services/session.service';
import {configurationService} from '../../../services/configuration.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'salesdocs-print-button',
    templateUrl: './src/modules/salesdocs/templates/salesdocsprintbutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '[style.display]': "getDisplay()"
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class SalesDocsPrintButton {

    showConvertModal: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private configurationService: configurationService, private session: session) {
    }

    print() {
        let params: Array<string> = [];
        params.push('sessionid=' + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + '/module/SalesDocs/' + this.model.id + '/printout?' + params.join('&'),
            '_blank' // <- open in a new window
        );
    }

    getDisplay() {
        return this.model.isEditing ? 'none' : 'inherit';
    }
}