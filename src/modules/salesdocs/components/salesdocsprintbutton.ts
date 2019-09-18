/**
 * @module ModuleSalesDocs
 */
import {Component} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {session} from '../../../services/session.service';
import {configurationService} from '../../../services/configuration.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'salesdocs-print-button',
    templateUrl: './src/modules/salesdocs/templates/salesdocsprintbutton.html'
})
export class SalesDocsPrintButton {

    public disabled: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private configurationService: configurationService, private session: session) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    public execute() {
        let params: string[] = [];
        params.push('sessionid=' + this.session.authData.sessionId);
        window.open(
            this.configurationService.getBackendUrl() + '/module/SalesDocs/' + this.model.id + '/printout?' + params.join('&'),
            '_blank' // <- open in a new window
        );
    }

    private handleDisabled() {
        this.disabled = this.model.isEditing ? true : false;
    }
}
