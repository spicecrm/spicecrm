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

    sequenced: boolean;

    constructor(private language: language, private model: model, private view: view ) { }

    get editing() {
        return this.view.isEditMode();
    }

    ngOnInit() {
        this.parseParams();
        this.model.data$.subscribe( () => { this.parseParams(); } );
    }

    parseParams() {
        if ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ) {
            let config = JSON.parse(this.model.data.questiontypeparameter);
            if ( config.text ) {
                this.sequenced = config.text.sequenced;
            }
        }
    }

    writeSettings() {
        let config =  ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ? JSON.parse( this.model.data.questiontypeparameter ):{});
        config.text = {
            sequenced: this.sequenced
        };
        this.model.data.questiontypeparameter = JSON.stringify(config);
    }

    click() {
        this.sequenced = !this.sequenced;
        this.writeSettings();
    }

}