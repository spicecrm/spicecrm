/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {helper} from "../../../services/helper.service";

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'questionset-type-parameters-nps',
    templateUrl: './src/modules/questionnaires/templates/questionsettypeparametersnps.html',
    providers: [helper]
})
export class QuestionsetTypeParametersNPS implements OnInit {

    private componentId: string;
    private textForScore0 = '';
    private textForScore10 = '';

    constructor( private language: language, private model: model, private view: view, private toast: toast, private helper: helper ) {
        this.componentId = _.uniqueId();
    }

    get editing(): boolean {
        return this.view.isEditMode();
    }

    public ngOnInit(): void {
        this.parseParams();
        this.model.data$.subscribe( () => this.parseParams() );
    }

    /**
     * The question type specific settings are stored in the field "questiontypeparameter" as json string.
     * This method parses the json string to an object.
     */
    private parseParams(): void {
        let jsonString = this.model.getField('questiontypeparameter');
        if ( jsonString !== '' ) {
            let config = JSON.parse( jsonString );
            if ( config.nps ) {
                this.textForScore0 = config.nps.textForScore0;
                this.textForScore10 = config.nps.textForScore10;
            }
        }
    }

    /**
     * The question type specific settings are stored in the field "questiontypeparameter" as json string.
     * This method should be called after any change of any setting. It generates the json string and writes it to the model.
     */
    private writeSettings(): void {
        let config =  ( this.model.data.questiontypeparameter && this.model.data.questiontypeparameter !== '' ? JSON.parse( this.model.data.questiontypeparameter ):{});
        config.nps = {
            textForScore0: this.textForScore0,
            textForScore10: this.textForScore10
        };
        this.model.setField('questiontypeparameter', JSON.stringify( config ));
    }

}
