import { Component, OnInit } from '@angular/core';
import { model } from '../../../services/model.service';
import { metadata } from '../../../services/metadata.service';
import { backend } from '../../../services/backend.service';
import { language } from '../../../services/language.service';

@Component({
    templateUrl: './src/modules/questionnaires/templates/questionnaireresults.html'
})
export class QuestionnaireResults implements OnInit {

    private isLoading = true;
    private noParticipation = false;
    private questionsets: any[] = [];

    constructor( private model: model, private metadata: metadata, private language: language, private backend: backend ) { }

    public ngOnInit(): void {
        this.loadQuestionSetsWithResults();
    }

    private loadQuestionSetsWithResults(): void {
        this.backend.getRequest('module/Questionnaires/results/' + this.model.module + '/' + this.model.id ).subscribe((data: any) => {
            this.isLoading = false;
            if ( data.participation === false ) {
                this.noParticipation = true;
                this.questionsets.length = 0;
            } else {
                this.questionsets = data.questionsets;
                this.noParticipation = false;
            }
        });
    }

    private reload(): void {
        this.isLoading = true;
        this.noParticipation = false;
        this.loadQuestionSetsWithResults();
    }

}
