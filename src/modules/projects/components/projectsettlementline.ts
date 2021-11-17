/**
 * @module ModuleActivities
 */
import {
    Component, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import {Params, Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {layout} from '../../../services/layout.service';
import {backend} from '../../../services/backend.service';
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

/**
 * renders a line in the settlement table
 */
@Component({
    selector: '[project-settlement-line]',
    templateUrl: './src/modules/projects/templates/projectsettlementline.html',
    providers: [model, view]
})
export class ProjectSettlementLine implements OnInit, OnDestroy {

    /**
     * the activity passed in
     */
    @Input() projectactivitiy: any;

    /**
     * holds the components subscriptions
     *
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(
        private model: model,
        private view: view
    ) {
        this.view.isEditable = true;
        this.view.displayLabels = false;
    }

    /**
     * initialize the model
     */
    public ngOnInit(): void {
        // initialize the tab
        this.model.module = 'ProjectActivities';
        this.model.id = this.projectactivitiy.id;
        this.model.data = this.model.utils.backendModel2spice('ProjectActivities', this.projectactivitiy);

        this.subscriptions.add(
            this.model.mode$.subscribe(
                mode => {
                    if(mode == 'edit' && !this.model.getField('corrected_duration')){
                        this.model.setField('corrected_duration', this.model.getField('activity_duration'));
                    }
                }
            )
        )
    }

    /**
     * unsubscribe from all
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public save(){
        if(this.model.validate()){
            this.model.save();
            this.view.setViewMode();
        }
    }

}
