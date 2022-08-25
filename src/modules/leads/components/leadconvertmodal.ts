/**
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Observable, Subject} from "rxjs";

/**
 * a separet modal to display the steps for th elad comversion as well as the progress
 */
@Component({
    selector: 'lead-convert-modal',
    templateUrl: '../templates/leadconvertmodal.html'
})
export class LeadConvertModal implements OnInit {

    /**
     * reference to the modal itsefl
     */
    public self: any;

    /**
     * the actions to be performed
     */
    @Input() public saveactions: any[] = [];

    /**
     * an event emiter emitting when the conversion was completed
     */
    @Output() public completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public language: language) {

    }

    public ngOnInit(): void {
        this.processConvertActions();
    }

    /**
     * simple function to return the status icon based on the status of the step
     *
     * @param status
     */
    public getStatusIcon(status) {
        switch (status) {
            case 'initial':
                return 'clock';
            case 'completed':
                return 'check';
        }
    }

    /**
     * processes the convert action recursively
     */
    public processConvertActions() {
        let nextAction = '';
        this.saveactions.some(item => {
            if (item.status === 'initial') {
                nextAction = item;
                return true;
            }
        });

        if (nextAction) {
            this.processConvertAction(nextAction);
        } else {
            this.completed.emit(true);
            this.self.destroy();
        }
    }

    /**
     * processes one action with the save and then calls the process action again
     * until all actions are completed
     *
     * @param item
     */
    public processConvertAction(item) {
        item.model.save().subscribe(data => {
            this.completeConvertAction(item.action);
        });
    }

    /**
     * sets the convert action to completed and processes the next one
     *
     * @param action
     */
    public completeConvertAction(action) {
        this.saveactions.find(item => item.action === action).status = 'completed';

        // start the next step
        this.processConvertActions();
    }
}
