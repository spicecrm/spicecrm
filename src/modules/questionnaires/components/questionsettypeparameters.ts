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
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";

@Component({
    selector: 'questionset-type-parameters',
    templateUrl: './src/modules/questionnaires/templates/questionsettypeparameters.html'
})
export class QuestionsetTypeParameters implements OnInit {

    private sectionIsOpen = true;
    private questiontypeFieldconfig = { readonly: false };

    constructor( private language: language, private model: model, private toast: toast ) { }

    public ngOnInit(): void {
        if ( this.model.isLoading ) {
            this.model.data$.subscribe( () => this.doWhenLoaded() );
        } else this.doWhenLoaded();
    }

    // to do:   Wenn in QuestionsManagerAddModal in erste Fragen angelegt werden oder alle Fragen gelöscht werden,
    //          reagiert das Feld "questiontype" mit seinem readonly-Status nicht. Sind zwei verschiedene Models, wissen voneinander nix.

    private doWhenLoaded(): void {
        if ( this.questionsetHasQuestions() ) this.questiontypeFieldconfig.readonly = true;
    }

    private toggleSection(): void {
        this.sectionIsOpen = !this.sectionIsOpen;
    }

    private getOpenStyle() {
        if ( !this.sectionIsOpen ) {
            return {
                height: '0px',
                transform: 'rotateX(90deg)'
            };
        }
    }

    private questionsetHasQuestions(): boolean {
        let questionsExists = false;
        if ( this.model && this.model.data && this.model.data.questions ) {
            questionsExists = (Object.keys( this.model.data.questions.beans ).length !== 0 );
        }
        return questionsExists;
    }

}
