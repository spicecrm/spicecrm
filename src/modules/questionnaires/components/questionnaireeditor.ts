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
 * @module ModuleQuestionnaire
 */
import { Component, ViewChild, OnInit, EventEmitter } from "@angular/core";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {QuestionnaireRender} from '../components/questionnairerender';

@Component({
    selector: 'questionnaire-editor',
    templateUrl: "./src/modules/questionnaires/templates/questionnaireeditor.html",
    styles: [
        'slds-tabs_default__content'
    ]
})
export class QuestionnaireEditor implements OnInit {

    private questionsets: any[] = [];

    private isLoadingQuestionsets = true;

    private categorypool = {
        loaded: false,
        event: new EventEmitter<any>(),
        list: []
    };

    @ViewChild(QuestionnaireRender, {static:false}) public questionnaireRender;

    constructor( private lang: language, private model: model, private backend: backend,  ) { } // private questionnaireParticipation: questionnaireParticipationService

    public ngOnInit(): void {
        if ( this.model.id ) {
            this.loadQuestionsets();
            this.loadQuestionOptionCategories();
            this.createPreview();
        } else {
            this.model.data$.subscribe( () => {
                this.loadQuestionsets();
                this.loadQuestionOptionCategories();
                this.createPreview();
            });
        }
    }

    private createPreview() {
        1;
        // For the preview create a questionnaire "participation":
        // this.questionnaireParticipation.showQuestionnaireTitle = false;
        // this.questionnaireParticipation.editMode = 'preview';
        // this.questionnaireParticipation.initByQuestionnaire( this.model.id );
    }

    get isLoading() {
        return this.model.isLoading || this.isLoadingQuestionsets || !this.categorypool.loaded;
    }

    private addQuestionset( newQuestionset ) {
        if ( newQuestionset ) {
            this.questionsets.push( newQuestionset );
            this.sortQuestionsets();
        }
    }

    private reloadPreview(): void {
        this.questionnaireRender.reload();
    }

    private loadQuestionsets(): void {
        this.isLoadingQuestionsets = true;
        this.questionsets = [];
        this.backend.getRequest('module/Questionnaires/'+this.model.id+'/related/questionsets', {limit: 999}).subscribe( questionsets => {
            for (let key of Object.keys( questionsets )) this.questionsets.push( questionsets[key] );
            this.sortQuestionsets();
            this.isLoadingQuestionsets = false;
        });
    }

    private loadQuestionOptionCategories(): void {
        this.backend.getRequest('QuestionOptionCategories/getList').subscribe(( response: any ) => {
            let allCategories = response;
            if ( this.model.getField('categorypool') ) {
                let categorypool = this.model.getField('categorypool').split(',');
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

    private sortQuestionsets(): void {
        this.questionsets.sort((a, b) => {
            return parseInt(a.position, 10 ) - parseInt( b.position, 10 );
        });
    }

    private removeQuestionset( i: number ): void {
        this.questionsets.splice( i,1 );
    }

    private trackBy( index: number, item: any ): string {
        return item.id;
    }

    private changeQuestionset( questionset: any, i: number ) {
        this.questionsets[i] = questionset;
        this.sortQuestionsets();
    }

    private drop(event) {
        let previousItem = this.questionsets.splice( event.previousIndex, 1 );
        this.questionsets.splice( event.currentIndex, 0, previousItem[0] );
        let updateArray = [];
        let i = 0;
        for ( let item of this.questionsets ) {
            item.position = i;
            updateArray.push({ id: item.id, position: i });
            i++;
        }
        this.backend.postRequest( 'module/QuestionSets', {}, updateArray );
    }

    private dragStarted(e) {
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    private dragEnded(e) {
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

}
