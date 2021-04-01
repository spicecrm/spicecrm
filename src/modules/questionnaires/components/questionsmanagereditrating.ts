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
import { Component, OnInit, Input } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasicWithOptions } from './questionsmanagereditbasicwithoptions';

declare var _: any;
@Component({
    selector: 'questions-manager-edit-rating',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditrating.html'
})
export class QuestionsManagerEditRating extends QuestionsManagerEditBasicWithOptions implements OnInit {

    /**
     * The question set that the question belongs to.
     */
    @Input() public questionset: any = {};

    /**
     * Number of entries/columns of the rating.
     */
    public numEntries: number;

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        // Create the property "altTexts", if not yet existing in the question parameter object.
        // "altTexts" is an array and is specific for questions of type "rating".
        if ( typeof this.questionparameters.altTexts === 'undefined' ) {
            this.questionparameters.altTexts = {};
            this.writeQuestionparametersToModel();
        }
        this.model.data$.subscribe(data => {
            if ( !this.model.isLoading && !this.isBuilt ) this.buildEntries(); // model data is already available (loaded) AND buildEntries() has not been executed yet
        });
    }

    /**
     * Build the list of options, after the question model (with question options) has been loaded.
     */
    public buildEntries(): void {

        this.isBuilt = true;

        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans ) {
            this.model.data.questionoptions = {beans: {}};
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( ( a,b ) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i in keys ) {
            this.options[i] = this.model.data.questionoptions.beans[keys[i]];
            if ( this.questionparameters.altTexts[this.options[i].id] === 'undefined' ) this.questionparameters.altTexts[this.options[i].id] = '';
        }
        this.numEntries = this.options.length;
    }

    /**
     * Build the option list of a specific number (this.numEntries) of rows/entries.
     */
    public setNumEntries(): void {
        if ( this.numEntries == this.options.length ) return;
        else {
            if ( this.numEntries > this.options.length ) {
                this.addOptions( this.numEntries - this.options.length );
            } else {
                if ( this.numEntries < this.options.length ) {
                    let numEntries = this.numEntries;
                    for ( let i = this.options.length; i > numEntries; i-- ) this.deleteOption(i-1);
                }
            }
        }
    }

    /**
     * A service feature for the user:
     * Create the values (stored in "name") of the rating options automatically.
     * @param from The start value of the rating.
     * @param to The end value of the rating.
     */
    public fillRange( from: number, to: number ): void {
        for ( let up = from<to, i=0, v=from; ( up && v <= to ) || ( !up && v >= to ); up ? v++:v-- ) {
            this.options[i++].name = v;
        }
    }

    /**
     * Add on ore more options.
     */
    public addOptions( number = 1 ): string[] {
        let idsAdded = super.addOptions( number );
        this.numEntries = this.options.length;
        idsAdded.forEach( ( id: string ) => {
            this.questionparameters.altTexts[id] = '';
        });
        return idsAdded;
    }

    /**
     * Delete an option.
     * @param index Specifier of the option.
     */
    public deleteOption( index: number ): void {
        delete this.questionparameters.altTexts[this.options[index].id];
        super.deleteOption( index );
        this.numEntries = this.options.length;
    }

}
