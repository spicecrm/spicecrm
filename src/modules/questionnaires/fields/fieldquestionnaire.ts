/**
 * @module Questionnaires
 */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {fieldGeneric} from '../../../objectfields/components/fieldgeneric';
import {Router} from '@angular/router';
import {questionnaireParticipationService} from '../services/questionnaireparticipation.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'field-questionnaire',
    templateUrl: '../templates/fieldquestionnaire.html'
})
export class fieldQuestionnaire extends fieldGeneric implements AfterViewInit, OnInit, OnDestroy {

    public questionnaireParticipation: questionnaireParticipationService;
    public questionnaireId = '';

    /**
     * indicates that we have a valid field
     */
    public isValid = true;

    constructor( public model: model, public view: view, public language: language, public metadata: metadata, public router: Router ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        this.subscribeToModelDataChange();
        this.subscribeToModelEditCancel();
        this.subscriptions.add(
            this.model.validated$.subscribe( () => this.questionnaireParticipation && ( this.questionnaireParticipation.showInvalidities = true ))
        );
    }

    /**
     * Things to do, when the component QuestionnaireRender has created and emitted the questionnaireParticipationService.
     */
    public gotParticipation( p: questionnaireParticipationService ) {
        this.questionnaireParticipation = p;
        this.questionnaireParticipation.isLoaded$.subscribe( () => {
            this.isValid = !this.questionnaireParticipation.hasUnunsweredQuestions();
            this.setValid( this.isValid );
        });
    }

    /**
     * Subscribe to data changes to reset the formatted value
     */
    public subscribeToModelDataChange(): void {
        this.subscriptions.add(
            this.model.field$.subscribe( ( data ) => {
                if ( data.field === 'questionnaire_id' ) this.questionnaireId = this.model.getField('questionnaire_id');
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
                this.questionnaireParticipation.showInvalidities = false;
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
        this.isValid = !this.questionnaireParticipation.hasUnunsweredQuestions();
        this.setValid( this.isValid );
        if ( this.isValid ) {
            let answers = _.clone( this.questionnaireParticipation.getData() );
            let data = { answers: answers, questionnaireId: this.model.getField( 'questionnaire_id' ) };
            this.value = data;
        }
    }

    public showQuestionnaire(): boolean {
        return !!this.questionnaireId;
    }

    /**
     * Set the field to invalid. Currently that means that at least one required questions is unanswered.
     */
    public setValid( valid: boolean ): void {
        if ( !valid ) {
            this.setFieldError( this.language.getLabel('LBL_MISSING_ANSWERS'));
        } else {
            this.clearFieldError();
        }
    }

    /**
     * a getter to return the additonal css classes
     */
    get css_classes() {
        return this._css_classes;
    }

}
