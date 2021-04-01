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
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {helper} from "../../../services/helper.service";

@Component({
    selector: 'questionset-type-parameters-rating',
    templateUrl: './src/modules/questionnaires/templates/questionsettypeparametersrating.html',
    providers: [helper]
})
export class QuestionsetTypeParametersRating implements OnInit {

    private numEntries = 5;
    private fieldNumEntries: number;
    private entriesTable: any[] = [];

    constructor( private language: language, private model: model, private view: view, private toast: toast, private helper: helper ) { }

    get editing(): boolean {
        return this.view.isEditMode();
    }

    public ngOnInit(): void {
        this.parseParams();
        this.model.data$.subscribe( () => this.parseParams() );
    }

    private parseParams(): void {
        if ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ) {
            let config = JSON.parse(this.model.data.questiontypeparameter);
            if ( config.rating ) {
                this.numEntries = config.rating.numEntries;
                this.entriesTable = config.rating.entries;
            }
        } else this.buildTable();
        this.fieldNumEntries = this.numEntries;
    }

    private setNumEntries( event ): void {

        if ( this.questionsetHasQuestions() ) {
            this.toast.sendToast( this.language.getLabel('MSG_CANTCHANGE_QUESTIONSEXISTS'),'warning',null,true );
            event.target.value = this.numEntries;
            return;
        }

        // Should the table be shortened?
        if ( event.target.value < this.numEntries ) {

            // In the group of rows to be deleted: Are there any filled/dirty rows?
            let numToDeleteDirtyRows: number = 0;
            for ( let i = this.numEntries-1; i+1 > event.target.value; i-- ) {
                if ( !(this.entriesTable[i].value === '' && this.entriesTable[i].text === '' )) numToDeleteDirtyRows++;
            }

            // There are allready filled rows, so ask the user.
            if ( numToDeleteDirtyRows ) {
                this.helper.confirm( this.language.getLabel('QST_DELETE_ENTRIES'), this.language.getLabel( 'QST_DELETE_ENTRIES_LONG' )).subscribe( answer => {
                    if ( answer ) {
                        this.numEntries = event.target.value;
                        if ( this.numEntries != this.entriesTable.length ) {
                            this.buildTable();
                            this.writeSettings();
                        }
                    } else event.target.value = this.numEntries;
                });
            } else this.numEntries = event.target.value;

            // The table should be extended.
        } else this.numEntries = event.target.value;

        // In case of shortening or extension.
        if ( this.numEntries != this.entriesTable.length ) {
            this.buildTable();
            this.writeSettings();
        }

    }

    private questionsetHasQuestions(): boolean {
        let questionsExists = false;
        if ( this.model && this.model.data && this.model.data.questions ) {
            questionsExists = (Object.keys( this.model.data.questions.beans ).length !== 0);
        }
        return questionsExists;
    }

    private buildTable(): void {
        let i = this.entriesTable.length;
        if ( this.entriesTable.length > this.numEntries ) {
            // The user wants to shorten the table. -> Cut off rows from the end.
            while ( i > this.numEntries ) {
                this.entriesTable.pop();
                i--;
            }
        } else {
            // The user wants to build or extend the table. -> Add rows to the end.
            while (i < this.numEntries) {
                this.entriesTable.push({value: '', text: '', id: this.model.generateGuid()});
                i++;
            }
        }
    }

    private writeSettings(): void {
        let config =  ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ? JSON.parse( this.model.data.questiontypeparameter ):{});
        for ( let entry of this.entriesTable ) {
            entry.value = typeof entry.value === 'string' ? entry.value.trim() : entry.value;
            entry.text = entry.text.trim();
        }
        config.rating = {
            numEntries: this.numEntries,
            entries: this.entriesTable
        };
        this.model.data.questiontypeparameter = JSON.stringify(config);
    }

    private fillRange( from: number, to: number ): void {
        for ( let up = from<to, i=0, v=from; ( up && v <= to ) || ( !up && v >= to ); up ? v++:v-- ) {
            this.entriesTable[i++].value = v;
        }
        this.writeSettings();
    }

}
