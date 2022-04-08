/**
 * @module ModuleActivities
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {session} from '../../../services/session.service';
import {metadata} from '../../../services/metadata.service';
import {userpreferences} from '../../../services/userpreferences.service';

declare var moment: any;
declare var _: any;

/**
 * renders the header for the participants panel
 */
@Component({
    selector: '[activity-participation-panel-header]',
    templateUrl: '../templates/activityparticipationpanelheader.html',
    providers: [model]
})
export class ActivityParticipationPanelHeader implements OnInit {

    /**
     * the fieldset as input parameter
     */
    @Input() public fieldset: string;

    /**
     * the fields in the fieldset
     */
    public fieldsetfields: any[] = [];

    /**
     * sets the model module to contacts
     *
     * @param model
     * @param metadata
     * @param view
     */
    constructor(public model: model, public metadata: metadata, public view: view) {
        this.model.module = 'Contacts';
    }

    /**
     * loads the fieldset fields
     */
    public ngOnInit(): void {
        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }

}
