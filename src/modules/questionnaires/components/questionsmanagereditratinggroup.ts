/**
 * @module ModuleQuestionnaires
 */
import { Component, OnInit, Input } from '@angular/core';
import { model } from '../../../services/model.service';
import { language } from '../../../services/language.service';
import { view } from '../../../services/view.service';
import { QuestionsManagerEditBasic } from './questionsmanagereditbasic';

declare var _: any;
@Component({
    selector: 'questions-manager-edit-rating-group',
    templateUrl: '../templates/questionsmanagereditratinggroup.html'
})
export class QuestionsManagerEditRatingGroup extends QuestionsManagerEditBasic implements OnInit {

    @Input() public questionset: any = {};
    @Input() declare public categorypool;

    public entries: any[] = [];
    public options: any[] = [];
    public isBuilt = false;

    constructor( public language: language, public model: model, public view: view ) {
        super( language, model, view );
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.model.data$.subscribe(data => {
            if ( !this.model.isLoading && !this.isBuilt ) this.buildEntries(); // model data is already available (loaded) AND buildEntries() has not been executed yet
        });
    }

    /**
     * Build the list of options, after the question model (with question options) has been loaded.
     */
    public buildEntries(): void {
        this.isBuilt = true;
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

    public change(): void { null; }

}
