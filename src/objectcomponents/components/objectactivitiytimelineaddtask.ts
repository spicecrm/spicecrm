import {AfterViewInit, Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

declare var moment: any;

@Component({
    selector: 'object-activitiytimeline-add-task',
    templateUrl: './app/objectcomponents/templates/objectactivitytimelineaddtask.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineAddTask implements OnInit {

    formFields: Array<any> = [];
    formFieldSet: string = '';
    isExpanded: boolean = false;

    public get firstFormField() {
        return this.formFields.filter((item, index) => index === 0)
    }

    public get moreFormFields() {
        return this.formFields.filter((item, index) => index > 0)
    }

    constructor(private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService, private model: model, private view: view, private language: language, private modal: modal, private ViewContainerRef: ViewContainerRef) {
    }

    ngOnInit() {
        // initialize the model
        this.model.module = 'Tasks';
        this.model.data.name = 'Task';

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
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineAddTask', this.model.module);
        this.formFieldSet = componentconfig.fieldset;
        this.formFields = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }

    initializeTask(){
        this.model.module = 'Tasks';
        // SPICEUI-2
        this.model.id = this.model.generateGuid();
        this.model.initializeModel(this.activitiyTimeLineService.parent);

        // set some values
        this.model.data.name = 'Task';
    }

    onFocus() {
        if(!this.isExpanded) {
            this.isExpanded = true;
            this.initializeTask();
        }
    }

    expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentref => {
            //componentref.instance.setModel(this.model);
        })
    }

    cancel(){
        this.isExpanded = false;
    }

    save(){
        this.model.save().subscribe(data => {
            this.initializeTask();
            this.isExpanded = false;
        })
    }
}