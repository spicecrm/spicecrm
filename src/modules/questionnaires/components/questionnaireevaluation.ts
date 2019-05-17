/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, ViewChild, ViewContainerRef, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'questionnaire-evaluation',
    templateUrl: './src/modules/questionnaires/templates/questionnaireevaluation.html',
})
export class QuestionnaireEvaluation implements OnInit {

    @ViewChild('destination', {read: ViewContainerRef}) private destination: ViewContainerRef;

    @Input() public parentdata: any = {};
    @Input() public reference_id: string = '';
    @Input() public noAnimation = false;
    @Input() public usagePrint = false;
    @Input() set individualHeight(val) {
        if ( this.component  ) this.component.instance.individualHeight = val;
    }

    private component: any;
    private evaluationType: string;
    private sequenceNr: number = 0;
    private loading: boolean = true;

    private noEvaluationTypeDefined: boolean = false;
    private noParticipationYet: boolean = false;

    constructor(private language: language, private backend: backend, private metadata: metadata) { }

    public ngOnInit() {

        this.backend.getRequest( 'module/Questionnaires/evaluation/' + this.reference_id ).subscribe((data: any) => {

            if ( data.participated === false ) {
                this.noParticipationYet = true;
                this.loading = false;
                return;
            }

            this.evaluationType = data.evaluationType;

            switch (this.evaluationType) {
                case 'none':
                    this.noEvaluationTypeDefined = true;
                    break;
                case 'motivatoren':
                    this.metadata.addComponent('QuestionnaireEvaluationMotivatoren', this.destination).subscribe(componentRef => {
                        componentRef.instance.values = data.values;
                        componentRef.instance.sequenceNr = this.sequenceNr;
                        componentRef.instance.noAnimation = this.noAnimation;
                        componentRef.instance.usagePrint = this.usagePrint;
                        this.component = componentRef;
                    });
                    break;
                case 'bar':
                    this.metadata.addComponent('QuestionnaireEvaluationBar', this.destination).subscribe(componentRef => {
                        componentRef.instance.values = data.values;
                        componentRef.instance.sequenceNr = this.sequenceNr;
                        componentRef.instance.noAnimation = this.noAnimation;
                        componentRef.instance.usagePrint = this.usagePrint;
                        this.component = componentRef;
                    });
                    break;
                case 'mbti':
                    this.metadata.addComponent('QuestionnaireEvaluationMbti', this.destination).subscribe(componentRef => {
                        componentRef.instance.values = data.values;
                        componentRef.instance.sequenceNr = this.sequenceNr;
                        componentRef.instance.noAnimation = this.noAnimation;
                        componentRef.instance.usagePrint = this.usagePrint;
                        this.component = componentRef;
                    });
                    break;
                case 'ist':
                    this.metadata.addComponent('QuestionnaireEvaluationIst', this.destination).subscribe(componentRef => {
                        componentRef.instance.values = data.values;
                        componentRef.instance.sequenceNr = this.sequenceNr;
                        componentRef.instance.noAnimation = this.noAnimation;
                        componentRef.instance.usagePrint = this.usagePrint;
                        this.component = componentRef;
                    });
                    break;
                case 'spiderweb':
                    this.metadata.addComponent('QuestionnaireEvaluationSpiderweb', this.destination).subscribe(componentRef => {
                        componentRef.instance.values = data.values;
                        componentRef.instance.sequenceNr = this.sequenceNr;
                        componentRef.instance.noAnimation = this.noAnimation;
                        componentRef.instance.usagePrint = this.usagePrint;
                        this.component = componentRef;
                    });
                    break;
                case 'lmi':
                    this.metadata.addComponent('QuestionnaireEvaluationLmi', this.destination).subscribe(componentRef => {
                        componentRef.instance.values = data.values;
                        componentRef.instance.sequenceNr = this.sequenceNr;
                        componentRef.instance.noAnimation = this.noAnimation;
                        componentRef.instance.usagePrint = this.usagePrint;
                        this.component = componentRef;
                    });
                    break;
                default:
                    this.metadata.addComponent('QuestionnaireEvaluationDefault', this.destination).subscribe(componentRef => {
                        componentRef.instance.values = data.values;
                        componentRef.instance.sequenceNr = this.sequenceNr;
                        componentRef.instance.noAnimation = this.noAnimation;
                        componentRef.instance.evaluationType = this.evaluationType;
                        componentRef.instance.usagePrint = this.usagePrint;
                        this.component = componentRef;
                    });
                    break;

            }

            this.loading = false;
        });

    }

}
