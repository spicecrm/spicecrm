/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, Input } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';


@Component({
    selector: 'questions-manager-edit-binary',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditbinary.html',
})
export class QuestionsManagerEditBinary implements OnInit {

    @Input() questionset: any = {};
    @Input() categorypool;

    options: Array<any> = []; // Should always be 2 elements (left option and right option of binary question)

    constructor (private language: language, private model: model) { }

    ngOnInit() {
        if (this.model.isLoading)
            this.model.data$.subscribe( () => { this.buildEntries(); } );
        else
            this.buildEntries();
    }

    buildEntries() {
        if ( !this.model.data.questionoptions || !this.model.data.questionoptions.beans) {
            this.model.data.questionoptions = {beans: {}};
        }
        let keys = Object.keys( this.model.data.questionoptions.beans );
        keys.sort( (a,b) => { return this.model.data.questionoptions.beans[a].position - this.model.data.questionoptions.beans[b].position; } );
        for ( let i=0; i<2; i++ ) {
            if ( !keys[i] || !this.model.data.questionoptions.beans[keys[i]] ) {
                let newOptionId: string = this.model.generateGuid();
                if ( !keys[i] ) keys.push(newOptionId);
                this.model.data.questionoptions.beans[newOptionId] = {
                    id: newOptionId,
                    question_id: this.model.id,
                    name: '',
                    categories: '',
                    points: '',
                    position: i
                };
            }
            this.options[i] = this.model.data.questionoptions.beans[keys[i]];
        }
    }

    exchangeOptions() {
        let tmp = this.options[0];
        this.options[0] = this.options[1];
        this.options[1] = tmp;
        this.options[0].position = 0;
        this.options[1].position = 1;
        this.changeName();
    }

    handleChange(event) {
        if ( event === true ) this.changeName();
    }

    changeName() {
        this.model.setField('name', this.options[0].name+' / '+this.options[1].name );
    }

}