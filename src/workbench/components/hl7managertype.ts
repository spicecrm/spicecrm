/**
 * @module WorkbenchModule
 */
import {
    Component, Input
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
import { model } from '../../services/model.service';
import { take } from 'rxjs/operators';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
    selector: 'hl7-manager-type',
    templateUrl: '../templates/hl7managertype.html',
    providers: [model, view],
})
export class Hl7ManagerType {

    @Input() public messageDef: any;

    public showDetails: boolean[] = [];

    public fieldset: string;

    constructor( public backend: backend, public language: language, public view: view, public modal: modal, public model: model, public metadata: metadata, public clipboard: Clipboard ) { }

    public ngOnInit(): void {
        console.log(this.messageDef);
    }

    public ngOnChanges() {
        this.messageDef.rules.forEach( (rule) => this.showDetails.push(false));

        this.model.module = 'HL7Types';
        this.model.id = this.messageDef.id;
        // this.model.initializeModel();
        this.model.setData( this.messageDef );
        this.view.setEditMode();
        // this.model.startEdit();
    }

    public toggleDetails( active:number, show: boolean) {
        if ( !show ) this.showDetails[active] = false;
        else this.showDetails.forEach( (e,i) => this.showDetails[i] = ( i == active ));
    }

    /*
    public toggleActive( active1: number, active2: boolean ) {
        if ( !active2 ) this.showDetails[active1] = false;
        else this.showDetails.forEach( (e,i) => this.showDetails[i] = ( i == active1 ));


        this.backend.postRequest('/module/HL7Rules/setActive', null, {active:active1})
            .pipe(take(1))
            .subscribe({
                next: res => {
                    this.messageDef.active = res.active;
                },
                error: res => {
                }
        });

    }

     */
}
