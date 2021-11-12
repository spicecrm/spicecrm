/**
 * @module ModuleActivities
 */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

declare var moment: any;
declare var _: any;

/**
 * renders a panel with the participating users and contacts in the activity
 */
@Component({
    selector: 'activity-participation-panel',
    templateUrl: './src/modules/activities/templates/activityparticipationpanel.html',
    providers: [view]
})
export class ActivityParticipationPanel{

    /**
     * the participants as input to the field since this is rendered as part of a field
     */
    @Input() private participants: any[] = [];

    /**
     * indicates if we are editing or not. This trigers if the remove button is visible
     */
    @Input() private editmode: boolean = false;

    /**
     * the fieldset to render in the table
     */
    @Input() private fieldset: string;

    /**
     * an event emitter if an item is removed from the array. The field this is embedded in shoudl handle the removal from the relationship
     */
    @Output() private remove: EventEmitter<any> = new EventEmitter<any>();

    constructor(private model: model, private metadata: metadata, private view: view, private language: language) {
        this.view.isEditable = false;
        this.view.displayLabels = false;
    }

    /**
     * recieves the event and emits it
     *
     * @param participant
     */
    private removeParticipant(participant) {
        this.remove.emit(participant);
    }

    /**
     * trackby function for the participant to imporve rendering and performance
     *
     * @param participant
     * @param index
     */
    private participantid(index, participant) {
        return participant.id;
    }

}
