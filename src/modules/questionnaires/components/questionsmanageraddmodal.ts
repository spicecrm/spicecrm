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
