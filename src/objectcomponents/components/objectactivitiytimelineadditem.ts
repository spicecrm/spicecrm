/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';

/**
* @ignore
*/
declare var moment: any;


@Component({
    selector: 'object-activitiytimeline-add-item',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineadditem.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineAddItem implements OnInit {

    componentconfig: any = {};
    headerFieldSet: string = '';
    bodyFieldSet: string = '';

    isExpanded: boolean = false;

    constructor(private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService, private model: model, private view: view, private language: language, private modal: modal, private dockedComposer: dockedComposer, private ViewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        // initialize the model
        this.model.module = this.module;

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
        //let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineAddCall', this.model.module);
        this.headerFieldSet = this.componentconfig.headerfieldset;
        this.bodyFieldSet = this.componentconfig.bodyfieldset;
    }

    get module(){
        return this.componentconfig.module;
    }

    get actionset(){
        return this.componentconfig.actionset;
    }

    initializeModule(){
        this.model.module = this.module;
        // SPICEUI-2
        this.model.id = this.model.generateGuid();
        this.model.initializeModel(this.activitiyTimeLineService.parent);
    }

    onHeaderClick() {
        if(!this.isExpanded) {
            this.isExpanded = true;
            this.initializeModule();
        }
    }

    expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
    }

    dock(){
        this.dockedComposer.addComposer(this.model.module, this.model);
        this.isExpanded = false;
    }

    cancel(){
        this.isExpanded = false;
    }

    handleaction(event){
        this.initializeModule();
        this.isExpanded = false;
    }

}