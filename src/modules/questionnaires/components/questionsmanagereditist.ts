/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, Input } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'questions-manager-edit-ist',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditist.html'
})
export class QuestionsManagerEditIst implements OnInit {

    @Input() public questionset: any = {};
    @Input() public categorypool;

    private options: any[] = [];
    private minAnswers: string;
    private maxAnswers: string;

    private allCategories = [];

    constructor( private language: language, private model: model, private view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        if (this.model.isLoading) {
            this.model.data$.subscribe((data,data2) => this.buildEntries() );
        } else this.buildEntries();
    }

    private buildEntries(): void {
        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans ) {
            this.model.data.questionoptions = { beans: {} };
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => {
            return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position;
        });
        for ( let i in keys ) this.options[i] = this.model.data.questionoptions.beans[keys[i]];
        if ( this.model.data.questionparameter && this.model.data.questionparameter !== '' ) {
            let questionparameter = JSON.parse( this.model.data.questionparameter );
            this.minAnswers =  typeof questionparameter.minAnswers != 'undefined' ? questionparameter.minAnswers:'';
            this.maxAnswers = typeof questionparameter.maxAnswers != 'undefined' ? questionparameter.maxAnswers:'';
        }
    }

    private addOption(): void {
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
        this.options.push( this.model.data.questionoptions.beans[newOptionId] );
    }

    private deleteOption( index: number ): void {
        if ( this.model.data.questionoptions.beans[this.options[index].id].new_with_id ) {
            delete this.model.data.questionoptions.beans[this.options[index].id];
        } else {
            this.model.data.questionoptions.beans[this.options[index].id].deleted = 1;
        }
        this.options.splice( index, 1 );
    }

    private optionUp( i: number ): void {
        if ( i === 0 ) return;
        let posFirstRow = Number( this.options[i-1].position );
        let tmp = this.options[i-1];
        this.options[i-1] = this.options[i];
        this.options[i] = tmp;
        this.options[i-1].position = posFirstRow;
        this.options[i].position = posFirstRow+1;
    }
    private optionDown( i: number ): void {
        if ( i > this.options.length-1 ) return;
        let posFirstRow = this.options[i].position;
        let tmp = this.options[i+1];
        this.options[i+1] = this.options[i];
        this.options[i] = tmp;
        this.options[i].position = posFirstRow;
        this.options[i+1].position = posFirstRow+1;
    }

    private onChangeNumAnswers(): void {
        this.model.data.questionparameter = JSON.stringify({ minAnswers: this.minAnswers, maxAnswers:this.maxAnswers });
    }

    private change(): void {
        null;
    }

    private eventHappened( type, index ): void {
        if ( type === 'delete' ) this.deleteOption(index);
        else if ( type === 'up' ) this.optionUp(index);
        else if ( type === 'down' ) this.optionDown(index);
    }

}
