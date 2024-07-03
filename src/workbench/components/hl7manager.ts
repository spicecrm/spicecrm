/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {Subject} from 'rxjs';

import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {toast} from '../../services/toast.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {configurationService} from '../../services/configuration.service';
import {modal} from '../../services/modal.service';
import {view} from "../../services/view.service";

@Component({
    templateUrl: '../templates/hl7manager.html',
    providers: [view]
})
export class HL7Manager {

    public messageDefs: any[] = [];
    public selectedMessageDef: any;
    public isLoading = false;

    constructor( public backend: backend, public language: language, public view: view, public modal: modal )
    {
        this.load();
    }

    public load(): void {
        this.isLoading = true;
        this.backend.getRequest('module/HL7Types/allRules').subscribe({
            next: res => {
                this.messageDefs = res.rules;
                this.language.sortObjects(this.messageDefs, 'name');
                this.messageDefs.forEach( ( messageDef ) => this.language.sortObjects( messageDef.rules, 'hl7_segment'));
                this.isLoading = false;
            },
            error: res => {
                this.isLoading = false;
            }
        });
    }

    public reload(): void {
        this.messageDefs = [];
        this.load();
    }
}
