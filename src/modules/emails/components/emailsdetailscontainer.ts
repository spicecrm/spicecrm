import {Component, OnInit} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'emails-details-container',
    templateUrl: '../templates/emailsdetailscontainer.html',
    standalone: false
})
export class EmailsDetailsContainer implements OnInit {

    public componentconfig: { viewComponentset: string, composeComponentset: string; };

    constructor(private metadata: metadata, public model: model) {
    }

    get readOnly() {
        return this.model.getField('status') != 'draft' && this.model.getField('status') != 'created';
    }

    public ngOnInit() {
        if (!this.componentconfig.viewComponentset) {
            this.componentconfig.viewComponentset = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module).componentset;
        }
    }
}