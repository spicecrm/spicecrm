/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, Input } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import { view } from '../../../services/view.service';

@Component({
    selector: 'questions-manager-edit-single',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditsingle.html',
})
export class QuestionsManagerEditSingle implements OnInit {

    @Input() questionset: any = {};
    @Input() categorypool;

    options: Array<any> = [];
    formatOptionsHorizontal: Boolean;

    constructor (private language: language, private model: model, private view: view  ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        if (this.model.isLoading)
            this.model.data$.subscribe( () => { this.buildEntries(); } );
        else
            this.buildEntries();
    }

    buildEntries() {
        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans )
            this.model.data.questionoptions = {beans: {}};
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => { return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position; } );
        for ( let i in keys ) this.options[i] = this.model.data.questionoptions.beans[keys[i]];
        if ( this.model.data.questionparameter && this.model.data.questionparameter !== '' ) {
            let questionparameter = JSON.parse( this.model.data.questionparameter );
            this.formatOptionsHorizontal =  typeof questionparameter.formatOptionsHorizontal != 'undefined' ? questionparameter.formatOptionsHorizontal:false;
        }
    }

    addOption() {
        let newOptionId: string = this.model.generateGuid();
        this.model.data.questionoptions.beans[newOptionId] = {
            id: newOptionId,
            question_id: this.model.id,
            name: '',
            categories: '',
            points: '',
            position: this.options.length,
            new_with_id: true
        };
        this.options.push(this.model.data.questionoptions.beans[newOptionId]);
    }

    deleteOption(index: number) {
        if ( this.model.data.questionoptions.beans[ this.options[index].id ].new_with_id )
            delete this.model.data.questionoptions.beans[ this.options[index].id ];
        else
            this.model.data.questionoptions.beans[ this.options[index].id ].deleted = 1;
        this.options.splice(index, 1);
    }

    optionUp(i: number) {
        if ( i === 0 ) return;
        let posFirstRow = Number( this.options[i-1].position );
        let tmp = this.options[i-1];
        this.options[i-1] = this.options[i];
        this.options[i] = tmp;
        this.options[i-1].position = posFirstRow;
        this.options[i].position = posFirstRow+1;
    }
    optionDown(i: number) {
        if ( i > this.options.length-1 ) return;
        let posFirstRow = this.options[i].position;
        let tmp = this.options[i+1];
        this.options[i+1] = this.options[i];
        this.options[i] = tmp;
        this.options[i].position = posFirstRow;
        this.options[i+1].position = posFirstRow+1;
    }

    change() {
    }

    eventHappened( type, index ) {
        if ( type === 'delete' ) this.deleteOption( index );
        else if ( type === 'up' ) this.optionUp( index );
        else if ( type === 'down' ) this.optionDown( index );
    }

    clickCheckbox() {
        this.formatOptionsHorizontal = !this.formatOptionsHorizontal;
        this.model.data.questionparameter = JSON.stringify( { "formatOptionsHorizontal":this.formatOptionsHorizontal} );
    }

}