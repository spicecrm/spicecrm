/**
 * @module ServiceComponentsModule
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';



@Component({
    selector: 'service-activitiytimeline-add-servicecall',
    templateUrl: '../templates/serviceactivitytimelineaddservicecall.html',
    providers: [model, view]
})
export class ServiceActivitiyTimelineAddServiceCall implements OnInit {

    /**
     * the fieldset for the header. Pulled from the componentnconfig for the component and the module
     */
    public headerFieldSet: string = '';

    /**
     * the fieldset for the body. Pulled from the componentnconfig for the component and the module
     */
    public bodyFieldSet: string = '';

    public isExpanded: boolean = false;

    constructor(public metadata: metadata, public activitiytimeline: activitiytimeline, public model: model, public view: view, public language: language, public modal: modal, public ViewContainerRef: ViewContainerRef) {}

    public ngOnInit() {
        // initialize the model
        this.model.module = 'ServiceCalls';

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.activitiytimeline.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id) {
                this.model.data.parent_name = data.summary_text;
            }
        });

        // set view to editbale and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fields
        let componentconfig = this.metadata.getComponentConfig('ServiceActivitiyTimelineAddServiceCall', this.model.module);
        this.bodyFieldSet = componentconfig.bodyfieldset ? componentconfig.bodyfieldset : componentconfig.fieldset;
        this.headerFieldSet = componentconfig.headerfieldset;

    }

    public initializeCall(){
        this.model.module = 'ServiceCalls';
        this.model.initializeModel(this.activitiytimeline.parent);

    }

    public onFocus() {
        if(!this.isExpanded) {
            this.isExpanded = true;
            this.initializeCall();
        }
    }

    public expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentref => {
            componentref.instance.setModel(this.model);
        })
    }

    public collapse(){
        this.isExpanded = false;
    }

    public cancel(){
        this.isExpanded = false;
    }

    public save(){
        this.model.save().subscribe(data => {
            this.initializeCall();
            this.isExpanded = false;
        });
    }
}
