/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: '[activity-participation-panel-participant]',
    templateUrl: './src/modules/activities/templates/activityparticipationpanelparticipant.html',
    providers: [model]
})
export class ActivityParticipationPanelParticipant implements OnInit {
    @Input() private participant: any = {};
    @Input() private module: string;
    @Input() private editmode: boolean = false;
    @Input() private fieldset: string;

    private fieldsetfields: any[] = [];

    @Output() private remove: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private model: model, private metadata: metadata, private view: view) {
    }

    public ngOnInit(): void {
        this.model.module = this.participant.module;
        this.model.id = this.participant.id;
        this.model.data = this.model.utils.backendModel2spice(this.module, this.participant.data);

        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }

    private removeItem() {
        if (this.editmode) {
            this.remove.emit(true);
        }
    }

}
