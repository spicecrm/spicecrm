/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasic } from './questionsmanagereditbasic';
import { metadata } from '../../../services/metadata.service';

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

    constructor( public language: language, public model: model, public view: view, public metadata: metadata ) {
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

    public get canAddOption(): boolean {
        return this.metadata.checkModuleAcl('QuestionOptions', 'create');
    }

}
