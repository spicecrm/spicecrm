/**
 * @module ModuleActivities
 */
import {Component, EventEmitter, Input, OnInit, Output, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';

/**
 * renders a table line for one participant
 */
@Component({
    selector: '[activity-participation-panel-participant]',
    templateUrl: '../templates/activityparticipationpanelparticipant.html',
    providers: [model]
})
export class ActivityParticipationPanelParticipant implements OnInit {

    /**
     * the participant data as object
     */
    @Input() public participant: any = {};

    /**
     * the module for the record
     */
    @Input() public module: string;

    /**
     * if the record is in editmode and the remove btton should be rendered
     */
    @Input() public editmode: boolean = false;

    /**
     * the fieldset to be displayed. This needs to work for users and contacts
     */
    @Input() public fieldset: string;

    /**
     * the fields in the fieldset
     */
    public fieldsetfields: any[] = [];

    /**
     * an event emitter when the item shoudl be removed
     */
    @Output() public remove: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public model: model, @SkipSelf() public parent: model, public metadata: metadata, public view: view) {
    }

    /**
     * initializes the model and loads the fields
     */
    public ngOnInit(): void {
        this.model.module = this.participant.module;
        this.model.id = this.participant.id;
        this.model.setData(this.participant.data);
        this.model.parentmodel = this.parent;

        // get the fields for the fieldset
        this.fieldsetfields = this.metadata.getFieldSetFields(this.fieldset);
    }

    /**
     * handles the click on teh remove button and emits the event
     * @param event
     */
    public removeItem(event) {
        event.stopPropagation();
        if (this.editmode) {
            this.remove.emit(true);
        }
    }

}
