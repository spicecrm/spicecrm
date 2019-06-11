/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionset-type-parameters-text',
    templateUrl: './src/modules/questionnaires/templates/questionsettypeparameterstext.html',
})
export class QuestionsetTypeParametersText implements OnInit {

    private sequenced: boolean;

    constructor(private language: language, private model: model, private view: view ) { }

    private get editing(): boolean {
        return this.view.isEditMode();
    }

    public ngOnInit(): void {
        this.parseParams();
        this.model.data$.subscribe( () => this.parseParams() );
    }

    private parseParams(): void {
        if ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ) {
            let config = JSON.parse( this.model.data.questiontypeparameter );
            if ( config.text ) this.sequenced = config.text.sequenced;
        }
    }

    private writeSettings(): void {
        let config =  ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ? JSON.parse( this.model.data.questiontypeparameter ) : {} );
        config.text = {
            sequenced: this.sequenced
        };
        this.model.data.questiontypeparameter = JSON.stringify( config );
    }

    private click(): void {
        this.sequenced = !this.sequenced;
        this.writeSettings();
    }

}
