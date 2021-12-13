/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'questionset-type-parameters-text',
    templateUrl: '../templates/questionsettypeparameterstext.html',
})
export class QuestionsetTypeParametersText implements OnInit {

    public sequenced: boolean;

    constructor(public language: language, public model: model, public view: view ) { }

    public get editing(): boolean {
        return this.view.isEditMode();
    }

    public ngOnInit(): void {
        this.parseParams();
        this.model.data$.subscribe( () => this.parseParams() );
    }

    public parseParams(): void {
        if ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ) {
            let config = JSON.parse( this.model.data.questiontypeparameter );
            if ( config.text ) this.sequenced = config.text.sequenced;
        }
    }

    public writeSettings(): void {
        let config =  ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ? JSON.parse( this.model.data.questiontypeparameter ) : {} );
        config.text = {
            sequenced: this.sequenced
        };
        this.model.data.questiontypeparameter = JSON.stringify( config );
    }

    public click(): void {
        this.sequenced = !this.sequenced;
        this.writeSettings();
    }

}
