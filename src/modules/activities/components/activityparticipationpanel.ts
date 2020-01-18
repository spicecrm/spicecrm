/**
 * @module ObjectComponents
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: 'activity-participation-panel',
    templateUrl: './src/modules/activities/templates/activityparticipationpanel.html',
    providers: [view]
})
export class ActivityParticipationPanel{
    @Input() private participants: any[] = [];
    @Input() private editmode: boolean = false;
    @Input() private fieldset: string;

    @Output() private remove: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private metadata: metadata, private view: view, private language: language) {
        this.view.isEditable = false;
        this.view.displayLabels = false;
    }

    private removeParticipant(participant) {
        this.remove.emit(participant);
    }

    /**
     * trackby function for the participant to imporve rendering and performance
     *
     * @param participant
     */
    private participantid(participant) {
        return participant.id;
    }

}
