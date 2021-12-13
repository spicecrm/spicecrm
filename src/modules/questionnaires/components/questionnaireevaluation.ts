/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, ViewChild, ViewContainerRef, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'questionnaire-evaluation',
    templateUrl: '../templates/questionnaireevaluation.html',
})
export class QuestionnaireEvaluation implements OnInit {

    @ViewChild('destination', {read: ViewContainerRef, static: true}) public destination: ViewContainerRef;

    @Input() public parentdata: any = {};
    @Input() public reference_id = '';
    @Input() public reference_type = '';
    @Input() public noAnimation = false;
    @Input() public usagePrint = false;
    @Input() public set individualHeight( val: number ) {
        if ( this.component  ) this.component.instance.individualHeight = val;
    }

    public component: any;
    public evaluationType: string;
    public sequenceNr = 0;
    public loading = true;

    public noEvaluationTypeDefined = false;
    public noParticipationYet = false;

    constructor( public language: language, public backend: backend, public metadata: metadata ) { }

    public ngOnInit(): void {

        this.backend.getRequest( 'module/QuestionnaireParticipations/byParent/'+this.reference_type+'/'+this.reference_id+'/evaluation').subscribe((data: any) => {

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
