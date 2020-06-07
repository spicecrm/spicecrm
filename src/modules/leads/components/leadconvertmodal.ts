/**
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {Observable, Subject} from "rxjs";

@Component({
    selector: 'lead-convert-modal',
    templateUrl: './src/modules/leads/templates/leadconvertmodal.html'
})
export class LeadConvertModal implements OnInit {

    private self: any;

    @Input() private saveactions: any[] = [];

    @Output() private completed: EventEmitter<boolean> = new EventEmitter<boolean>();

    private convertSubject: Subject<boolean> = undefined;

    constructor(private language: language) {

    }

    public ngOnInit(): void {
        this.processConvert();
    }

    private getStatusIcon(status) {
        switch (status) {
            case 'initial':
                return 'clock';
            case 'completed':
                return 'check';
        }
    }



    private processConvert(): Observable<boolean> {
        this.convertSubject = new Subject<boolean>();
        this.processConvertActions();
        return this.convertSubject.asObservable();
    }

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
            this.convertSubject.next(true);
            this.convertSubject.complete();
            this.completed.emit(true);
            this.self.destroy();
        }
    }

    private processConvertAction(item) {
        item.model.save().subscribe(data => {
            item.model.data = item.model.utils.backendModel2spice(item.model.module, data);
            this.completeConvertAction(item.action);
        });
    }

    private completeConvertAction(action) {
        this.saveactions.find(item => item.action === action).status = 'completed';

        // start the next step
        this.processConvertActions();
    }
}
