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
import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasic } from './questionsmanagereditbasic';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'questions-manager-edit-basic-with-options',
    template: ''
})
export class QuestionsManagerEditBasicWithOptions extends QuestionsManagerEditBasic implements OnInit {

    /**
     * List of question options.
     */
    public options: any[] = [];

    /**
     * Is the list of options already built from question model?
     */
    public isBuilt = false;

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    /**
     * Add on ore more options.
     */
    public addOptions( number = 1 ): string[] {
        let idsAdded = [];
        for ( let i=0; i<number; i++ ) {
            let newOptionId: string = this.model.generateGuid();
            if( !this.model.data.questionoptions ) this.model.data.questionoptions = {};
            if( !this.model.data.questionoptions.beans ) this.model.data.questionoptions.beans = {};
            this.model.data.questionoptions.beans[newOptionId] = {
                id: newOptionId,
                question_id: this.model.id,
                name: '',
                categories: '',
                points: '',
                position: this.options.length,
                new_with_id: true
            };
            this.options.push( this.model.data.questionoptions.beans[newOptionId] );
            idsAdded.push( newOptionId );
        }
        return idsAdded;
    }

    /**
     * Delete an option:
     * Delete it from array if new and not yet existing in backend.
     * Mark it deleted if already existing in the backend.
     * @param index Specifier of the option.
     */
    public deleteOption( index: number ): void {
        if ( this.model.data.questionoptions.beans[ this.options[index].id ].new_with_id ) {
            delete this.model.data.questionoptions.beans[ this.options[index].id ];
        } else {
            this.model.data.questionoptions.beans[ this.options[index].id ].deleted = 1;
        }
        this.options.splice( index, 1 );
    }

    /**
     * Move an option one position up.
     * @param i Specifier of the option.
     */
    public optionUp( i: number ): void {
        if ( i === 0 ) return;
        let posFirstRow = Number( this.options[i-1].position );
        let tmp = this.options[i-1];
        this.options[i-1] = this.options[i];
        this.options[i] = tmp;
        this.options[i-1].position = posFirstRow;
        this.options[i].position = posFirstRow+1;
    }

    /**
     * Move an option one position down.
     * @param i Specifier of the option.
     */
    public optionDown( i: number ): void {
        if ( i > this.options.length-1 ) return;
        let posFirstRow = this.options[i].position;
        let tmp = this.options[i+1];
        this.options[i+1] = this.options[i];
        this.options[i] = tmp;
        this.options[i].position = posFirstRow;
        this.options[i+1].position = posFirstRow+1;
    }

    /**
     * Receive and handle an event from the component QuestionsManagerEditOptionSingleMulti.
     * What happened to one of the options? Deletion? A move up? A move down?
     * @param type Type of the event (delete/up/down).
     * @param index Specifier of the option.
     */
    public optionEventHappened( type, index ): void {
        if ( type === 'delete' ) this.deleteOption( index );
        else if ( type === 'up' ) this.optionUp( index );
        else if ( type === 'down' ) this.optionDown( index );
    }

}
