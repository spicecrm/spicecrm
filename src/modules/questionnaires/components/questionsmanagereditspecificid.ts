/**
 * @module ModuleQuestionnaires
 */
import { Component, Input } from '@angular/core';
import {model} from '../../../services/model.service';
import {backend} from "../../../services/backend.service";
import { take } from 'rxjs/operators';
import {toast} from '../../../services/toast.service';

@Component({
    selector: 'questions-manager-specific-id',
    templateUrl: '../templates/questionsmanagerspecificid.html',
    providers: [model],
    styles: ['span.slds-badge:hover { cursor: pointer; }'],
    standalone: false
})
export class QuestionsManagerSpecificID {

    @Input() public question: any;

    public isSaving = false;
    public editMode = false;

    constructor( public model: model, public backend: backend, public toast: toast ) { }

    public save(): void {
        this.isSaving = true;
        this.model.save()
            .pipe(take(1))
            .subscribe(modeldata => {
                this.question.specific_id = this.model.getField('specific_id');
                this.isSaving = false;
                this.editMode = false;
            },
                error => {
                    this.toast.sendToast('Error saving data', 'error');
                    this.isSaving = false;
                });
    }

    public edit()
    {
        this.editMode = true;
        this.model.module = 'Questions';
        this.model.id = this.question.id;
        this.model.setField('specific_id', this.question.specific_id);
    }

    public cancel() {
        this.editMode = false;
    }

    public get specificID() {
        return this.model.getField('specific_id');
    }

    public set specificID( val: any ) {
        this.model.setField('specific_id', val);
    }

}
