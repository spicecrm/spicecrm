/**
 * @module ServiceComponentsModule
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {activitiyTimeLineService} from '../../../services/activitiytimeline.service';



@Component({
    selector: 'service-activitiytimeline-add-servicecall',
    templateUrl: './src/modules/servicecomponents/templates/serviceactivitytimelineaddservicecall.html',
    providers: [model, view]
})
export class ServiceActivitiyTimelineAddServiceCall implements OnInit {

    formFields: Array<any> = [];
    formFieldSet: string = '';
    isExpanded: boolean = false;

    public get firstFormField() {
        return this.formFields.filter((item, index) => index === 0)
    }

    public get moreFormFields() {
        return this.formFields.filter((item, index) => index > 0)
    }

    constructor(private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService, private model: model, private view: view, private language: language, private modal: modal, private ViewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        // initialize the model
        this.model.module = 'ServiceCalls';

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.activitiyTimeLineService.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id = this.model.data.parent_id)
                this.model.data.parent_name = data.summary_text;
        })

        // set view to editbale and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fields
        let componentconfig = this.metadata.getComponentConfig('ServiceActivitiyTimelineAddServiceCall', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
        this.formFields = this.metadata.getFieldSetItems(componentconfig.fieldset);
    }

    initializeCall(){
        this.model.module = 'ServiceCalls';
        this.model.initializeModel(this.activitiyTimeLineService.parent);

    }

    onFocus() {
        if(!this.isExpanded) {
            this.isExpanded = true;
            this.initializeCall();
        }
    }

    expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentref => {
            componentref.instance.setModel(this.model);
        })
    }

    collapse(){
        this.isExpanded = false;
    }

    cancel(){
        this.isExpanded = false;
    }

    save(){
        this.model.save().subscribe(data => {
            this.initializeCall();
            this.isExpanded = false;
        })
    }
}