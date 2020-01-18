/**
 * @module ObjectComponents
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {session} from '../../../services/session.service';
import {metadata} from '../../../services/metadata.service';
import {userpreferences} from '../../../services/userpreferences.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: '[activity-participation-panel-header]',
    templateUrl: './src/modules/activities/templates/activityparticipationpanelheader.html',
    providers: [model]
})
export class ActivityParticipationPanelHeader implements OnInit {
    @Input() private fieldset: string;
    @Input() private editmode: boolean = false;
    private fieldsetfields: any[] = [];


    constructor(private model: model, private metadata: metadata, private view: view) {
        this.model.module = 'Contacts';
    }

    public ngOnInit(): void {
        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }

}
