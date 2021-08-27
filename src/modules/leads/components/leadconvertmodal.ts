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
    templateUrl: './src/modules/leads/templates/leadconvertmodal.html'
})
export class LeadConvertModal implements OnInit {

    /**
     * reference to the modal itsefl
     */
    private self: any;

    /**
     * the actions to be performed
     */
    @Input() private saveactions: any[] = [];

    /**
     * an event emiter emitting when the conversion was completed
     */
    @Output() private completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private language: language) {

    }

    public ngOnInit(): void {
        this.processConvertActions();
    }

    /**
     * simple function to return the status icon based on the status of the step
     *
     * @param status
     */
    private getStatusIcon(status) {
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
    private processConvertActions() {
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
    private processConvertAction(item) {
        item.model.save().subscribe(data => {
            item.model.data = item.model.utils.backendModel2spice(item.model.module, data);
            this.completeConvertAction(item.action);
        });
    }

    /**
     * sets the convert action to completed and processes the next one
     *
     * @param action
     */
    private completeConvertAction(action) {
        this.saveactions.find(item => item.action === action).status = 'completed';

        // start the next step
        this.processConvertActions();
    }
}
