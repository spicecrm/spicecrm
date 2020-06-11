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
    templateUrl: './src/modules/servicecomponents/templates/serviceactivitytimelineaddservicecall.html',
    providers: [model, view]
})
export class ServiceActivitiyTimelineAddServiceCall implements OnInit {

    /**
     * the fieldset for the header. Pulled from the componentnconfig for the component and the module
     */
    private headerFieldSet: string = '';

    /**
     * the fieldset for the body. Pulled from the componentnconfig for the component and the module
     */
    private bodyFieldSet: string = '';

    public isExpanded: boolean = false;

    constructor(private metadata: metadata, private activitiytimeline: activitiytimeline, private model: model, private view: view, private language: language, private modal: modal, private ViewContainerRef: ViewContainerRef) {}

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

    private initializeCall(){
        this.model.module = 'ServiceCalls';
        this.model.initializeModel(this.activitiytimeline.parent);

    }

    private onFocus() {
        if(!this.isExpanded) {
            this.isExpanded = true;
            this.initializeCall();
        }
    }

    private expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentref => {
            componentref.instance.setModel(this.model);
        })
    }

    private collapse(){
        this.isExpanded = false;
    }

    private cancel(){
        this.isExpanded = false;
    }

    private save(){
        this.model.save().subscribe(data => {
            this.initializeCall();
            this.isExpanded = false;
        });
    }
}
