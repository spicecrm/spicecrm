/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    @ViewChild('destination', {read: ViewContainerRef, static: true}) private destination: ViewContainerRef;

    @Input() public parentdata: any = {};
    @Input() public reference_id = '';
    @Input() public reference_type = '';
    @Input() public noAnimation = false;
    @Input() public usagePrint = false;
    @Input() public set individualHeight( val: number ) {
        if ( this.component  ) this.component.instance.individualHeight = val;
    }

    private component: any;
    private evaluationType: string;
    private sequenceNr = 0;
    private loading = true;

    private noEvaluationTypeDefined = false;
    private noParticipationYet = false;

    constructor( private language: language, private backend: backend, private metadata: metadata ) { }

    public ngOnInit(): void {

        this.backend.getRequest( 'module/QuestionnaireParticipations/byReference/'+this.reference_type+'/'+this.reference_id+'/evaluation').subscribe((data: any) => {

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
