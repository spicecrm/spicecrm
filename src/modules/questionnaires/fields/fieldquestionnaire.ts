/**
 * @module Questionnaires
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {fieldGeneric} from '../../../objectfields/components/fieldgeneric';
import {Router} from '@angular/router';
import { questionnaireParticipationService } from '../services/questionnaireparticipation.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'field-questionnaire',
    templateUrl: '../templates/fieldquestionnaire.html'
})
export class fieldQuestionnaire extends fieldGeneric implements OnInit, OnDestroy {

    public questionnaireParticipation: questionnaireParticipationService;
    public questionnaireId = '';

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.questionnaireId = this.model.getField('questionnaire_id');
        this.subscribeToModelDataChange();
        this.subscribeToModelEditCancel();
    }

    /**
     * Subscribe to data changes to reset the formatted value
     */
    public subscribeToModelDataChange(): void {
        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                let dummy = this.model.getField('questionnaire_id');
                if ( dummy ) {
                    if( dummy !== this.questionnaireId ) {
                        this.questionnaireId = dummy;
                    }
                } else {
                    if ( this.questionnaireId ) this.questionnaireId = dummy;
                }
            })
        );
    }

    /**
     * Subscribe to changes of model edit status.
     */
    public subscribeToModelEditCancel(): void {
        this.subscriptions.add(
            this.model.canceledit$.subscribe( () => {
                this.questionnaireParticipation.reset();
            } )
        );
    }

    /**
     * Un-subscriptions when the component is destroyed.
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Is called by the questionaire partition service every modification of answer data.
     * Keeps the model field up to date with the current answer data.
     */
    public answersChanged(): void {
        let answers = _.clone( this.questionnaireParticipation.getData());
        let data = { answers: answers, questionnaireId: this.model.getField('questionnaire_id') };
        this.value = data;
    }

    public showQuestionnaire(): boolean {
        return !this.model.isNew && !!this.questionnaireId;
    }

}
