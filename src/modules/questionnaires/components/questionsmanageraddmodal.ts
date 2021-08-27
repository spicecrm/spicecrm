/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import { Observable, Subject } from 'rxjs';
import { QuestionsManagerEditMulti } from './questionsmanagereditmulti';

@Component({
    selector: 'questions-manager-addmodal',
    templateUrl: './src/modules/questionnaires/templates/questionsmanageraddmodal.html',
    providers: [model,view]
})
export class QuestionsManagerAddModal implements OnInit {

    @Input() public questionset: any = {};
    @Input() public questionid = '';
    @Input() public categorypool: any;
    @Input() public questiontype: string;

    public response: Observable<object> = null;
    private responseSubject: Subject<any> = null;

    private isLoading = false;

    private self: any;

    private questiontypes_dom: any;

    @ViewChild(QuestionsManagerEditMulti, {static:false}) private refQuestionsManagerEditMulti;

    constructor( private language: language, private model: model, private toast: toast, private backend: backend, private view: view ) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit(): void {
        this.questiontypes_dom = this.language.getDisplayOptions('questionstypes_dom');
        this.model.module = 'Questions';
        if ( this.questionid ) {
            this.isLoading = true;
            this.model.id = this.questionid;
            this.model.getData(true).subscribe( response => {
                this.questiontype = this.model.getField('questiontype');
                this.isLoading = false;
            });
        } else {
            this.model.initializeModel();
            this.model.setField('questionset_id', this.questionset.id );
            this.model.setField('id', this.model.id );
            this.model.setField('questiontype', this.questiontype );
        }
    }

    private cancelModal(): void {
        this.responseSubject.next( false );
        this.responseSubject.complete();
        this.self.destroy();
    }

    public onModalEscX() {
        this.cancelModal();
    }

    private saveQuestion(): void {
        let emptyRows = false;
        if ( this.questionset.data.questiontype === 'multi' ) this.refQuestionsManagerEditMulti.doBeforeSavingQuestion();
        if ( this.questionset.data.questiontype === 'single' || this.questionset.data.questiontype === 'multi' ) {
            if ( this.model.data.questionoptions && this.model.data.questionoptions.beans ) {
                for( let i in this.model.data.questionoptions.beans ) {
                    if( this.model.data.questionoptions.beans[i].name === '' && this.model.data.questionoptions.beans[i].deleted != 1 ) {
                        emptyRows = true;
                        break;
                    }
                }
            }
        }
        if ( emptyRows ) {
            this.toast.sendToast( 'You have empty rows. Complete or delete them before saving!', 'error', '', true );
        } else {
            if ( !!this.model.data.name ) {
                this.model.save().subscribe(modeldata => {
                    this.responseSubject.next( this.model.data );
                    this.responseSubject.complete();
                    this.self.destroy();
                });
            }
        }
    }

    private get savingAllowed(): boolean {
        return !!this.model.getField('name');
    }

}
