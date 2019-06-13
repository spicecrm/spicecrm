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
            this.toast.sendToast( this.language.getLabel('MSG_CANTCHANGE_QUESTIONSEXISTS'),'error',null,true );
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
