/**
 * @module ModuleQuestionnaires
 */
import {Component, OnInit, Input } from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'questions-manager-edit-rating',
    templateUrl: './src/modules/questionnaires/templates/questionsmanagereditrating.html'
})
export class QuestionsManagerEditRating implements OnInit {

    @Input() public questionset: any = {};
    @Input() public categorypool;

    private entries: any[] = [];
    private options: any[] = [];

    constructor( private language: language, private metadata: metadata, private model: model, private view: view ) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        if (this.model.isLoading) {
            this.model.data$.subscribe(data => {
                this.buildEntries();
            });
        } else this.buildEntries();
    }

    private buildEntries(): void {

        let config: any;
        try {
            config =  JSON.parse(this.questionset.data.questiontypeparameter);
        } catch ( e ) {
            return;
        }
        if ( config.rating && config.rating.entries ) this.entries = config.rating.entries;
        for (let entry of this.entries) {
            let isOptionFound: boolean = false;
            let optionFoundId: string;
            if (this.model.data.questionoptions && this.model.data.questionoptions.beans) {
                for ( let optionId in this.model.data.questionoptions.beans ) {
                    if( this.model.data.questionoptions.beans[optionId].questionset_type_parameter_id === entry.id ) {
                        isOptionFound = true;
                        optionFoundId = optionId;
                        continue;
                    }
                }
            } else this.model.data.questionoptions = {beans:{}};
            let newOptionId: string;
            if (!isOptionFound) {
                newOptionId = this.model.generateGuid();
                this.model.data.questionoptions.beans[newOptionId] = {
                    id: newOptionId,
                    question_id: this.model.id,
                    name: entry.value,
                    categories: '',
                    points: '',
                    questionset_type_parameter_id: entry.id
                };
            }
            this.options.push(this.model.data.questionoptions.beans[ isOptionFound ? optionFoundId : newOptionId ]);
        }
    }

    private change(): void { null; }

}
