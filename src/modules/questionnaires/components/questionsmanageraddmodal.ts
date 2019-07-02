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

    private categorypool = {
        loaded: false,
        event: new EventEmitter<any>(),
        list: []
    };

    public response: Observable<object> = null;
    private responseSubject: Subject<any> = null;

    // componentconfig = {};
    // questions = [];

    private self: any;

    @ViewChild(QuestionsManagerEditMulti, {static: false}) private refQuestionsManagerEditMulti;

    constructor( private language: language, private model: model, private toast: toast, private backend: backend, private view: view ) {
        this.responseSubject = new Subject<object>();
        this.response = this.responseSubject.asObservable();
    }

    public ngOnInit(): void {
        this.model.module = 'Questions';
        if ( this.questionid ) {
            this.model.id = this.questionid;
            this.model.getData(true);
        } else {
            this.model.initializeModel();
            this.model.data.questionset_id = this.questionset.id;
        }
        let params = {
            fields: JSON.stringify( ['id', 'name', 'abbreviation'] ),
            sortfield: 'name',
            limit: -99
        };
        this.backend.getRequest('module/QuestionOptionCategories', params).subscribe(( response: any ) => {
            let allCategories = response.list;
            if ( this.questionset.data.categorypool && this.questionset.data.categorypool != '' ) {
                let categorypool = this.questionset.data.categorypool.split(',');
                allCategories.forEach( category => {
                    for ( let categoryId of categorypool ) {
                        if ( category.id === categoryId ) {
                            this.categorypool.list.push( category );
                        }
                    }
                });
            }
            this.categorypool.loaded = true;
            this.categorypool.event.emit();
        });
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
            for( let i in this.model.data.questionoptions.beans ) {
                if( this.model.data.questionoptions.beans[i].name === '' && this.model.data.questionoptions.beans[i].deleted != 1 ) {
                    emptyRows = true;
                    break;
                }
            }
        }
        if ( emptyRows ) {
            this.toast.sendToast( 'You have empty rows. Complete or delete them before saving!', 'error', '', true );
        } else {
            this.model.save().subscribe(modeldata => {
                this.responseSubject.next( this.model.data );
                this.responseSubject.complete();
                this.self.destroy();
            });
        }
    }

}
