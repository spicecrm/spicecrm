/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleQuestionnaires
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { backend } from '../../../services/backend.service';
import { modal } from '../../../services/modal.service';
import { QuestionsManagerAddModal } from './questionsmanageraddmodal';

@Component({
    selector: 'questions-manager',
    templateUrl: './src/modules/questionnaires/templates/questionsmanager.html'
})
export class QuestionsManager implements OnInit {

    @Input() public showQuestionsetButtons = false;
    @Input() public categorypool: any;
    @Output() public questionsetAction: EventEmitter<string> = new EventEmitter();

    private questions: any[] = [];
    private currentQuestionId = '';
    private isLoading = true;
    private questiontypes = ['single','multi','binary','rating','nps','ist','text'];
    private questiontypes_dom: any;

    constructor( private language: language, private model: model, private backend: backend, private modalservice: modal ) { }

    public ngOnInit(): void {
        this.questiontypes_dom = this.language.getDisplayOptions('questionstypes_dom');
        this.backend.getRequest('module/QuestionSets/'+this.model.id+'/related/questions', {limit: 999} ).subscribe( (response: any) => {
            for ( let id in response ) {
                this.questions.push( this.model.utils.backendModel2spice('Questions', response[id] ));
            }
            // Sort questions by field "position" (number). Only in case "position" is equal then use "date_entered".
            this.questions = this.questions.sort(( a, b ) => {
                let deltaPos = a.position - b.position;
                if ( deltaPos === 0 ) {
                    return a.date_entered === b.date_entered ? 0 : a.date_entered > b.date_entered ? 1 : -1;
                } else return deltaPos;
            });
            this.isLoading = false;
        });
    }

    private addQuestion( questiontype, event ): void {
        event.preventDefault();
        this.currentQuestionId = '';
        this.openForm( questiontype );
    }

    private editQuestion(questionId): void {
        this.currentQuestionId = questionId;
        this.openForm();
    }

    private openForm( questiontype: string = null ): void {
        this.modalservice.openModal('QuestionsManagerAddModal' ).subscribe( form => {
            form.instance.questionset = this.model;
            form.instance.questionid = this.currentQuestionId;
            form.instance.categorypool = this.categorypool;
            form.instance.questiontype = questiontype;
            form.instance.response.subscribe( response => {
                this.handleFormResponse( response );
            });
        });
    }

    private getIndexOfQuestion( questionId: string ): number {
        let indexOfQuestion: number;
        this.questions.some((question, index) => {
            if (question.id === questionId) {
                indexOfQuestion = index;
                return true;
            }
        });
        return indexOfQuestion;
    }

    private deleteQuestion( questionId ): void {
        // First get the index position of the question. Because we only know the id of the question.
        let indexOfQuestion: number = this.getIndexOfQuestion(questionId);
        this.modalservice.confirm(
            this.language.getLabelFormatted( 'QST_DELETE_QUESTION_LONG', this.questions[indexOfQuestion].name ),
            this.language.getLabel( 'QST_DELETE_QUESTION' )).subscribe( ( answer ) => {
                if ( answer ) {
                    this.backend.deleteRequest( 'module/Questions/' + questionId );
                    this.questions.splice( indexOfQuestion, 1 );
                }
        });
    }

    private handleFormResponse( event ): void {
        if (event !== false) {
            if ( this.currentQuestionId === '' ) {
                this.questions.push( event );
            } else {
                this.questions.some( question => {
                   if ( question.id == event.id ) {
                       question.name = event.name;
                       return true;
                   }
                });
            }
        }
    }

    private drop(event) {
        let previousItem = this.questions.splice( event.previousIndex, 1 );
        this.questions.splice( event.currentIndex, 0, previousItem[0] );
        let updateArray = [];
        let i = 0;
        for ( let item of this.questions ) {
            item.position = i;
            updateArray.push({ id: item.id, position: i });
            i++;
        }
        this.backend.postRequest( 'module/Questions', {}, updateArray );
    }

    private dragStarted(e) {
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    private dragEnded(e) {
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
