import {Component, ComponentRef, EventEmitter, OnInit, Output, SkipSelf, Injector} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {modellist} from "../../../services/modellist.service";
import {view} from "../../../services/view.service";
import {Observable, Subject, Subscription} from "rxjs";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'global-header-document-revisions-modal',
    templateUrl: '../templates/globalheaderdocumentrevisionsmodal.html',
    providers: [model, view, modellist]
})
export class GlobalHeaderDocumentRevisionsModal implements OnInit {

    public self: ComponentRef<GlobalHeaderDocumentRevisionsModal>;

    public fieldset: string = '';

    public componentconfig: any;
    public relatedRevisions = [];

    constructor(
        public backend: backend,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector,
        public view: view,
        public modellist: modellist,
    ) {
        // this.model.module = 'DocumentRevisions';
        // this.model.initialize();
        // this.backend.getRequest(`/module/documentrevisions/relatedRevisions/${this.model.data.assigned_user_id}`).subscribe(
        //     res => {
        //         this.relatedRevisions = res;
        //         console.log('Test')

        // })

    }


    public ngOnInit() {
        this.model.module = 'DocumentRevisions';
        this.model.initialize();
        this.loadRelated();
        // this.model.module = 'DocumentRevisions'
        // get the config
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderDocumentRevisionsModal', 'DocumentRevisions');
        this.fieldset = componentconfig.fieldset;
    }



    public loadRelated(){

        this.backend.getRequest(`/module/documentrevisions/relatedRevisions/${this.model.data.assigned_user_id}`).subscribe(
            res => {
                this.relatedRevisions = res;


                // this.orgunits = beans.orgunits;
                // this.orgcharts = beans.orgcharts;
            })
    }

    /**
     * process one step by rendering the modal component
     *
     * @param id
     */
    process(id) {
        let step = this.relatedRevisions.find(s => s.id == id);
        // if(step && !step.completed && step.component){
            this.modal.openModal(step.document_revision, true, this.injector).subscribe(modalref => {
                modalref.instance.completed$.subscribe(result => {
                    if (result) {
                        step.completed = true;
                    }
                })
            });
    }

    /**
     * emits when an item is selected and which items are selected
     */
    @Output() public selectedItems = new EventEmitter<any>();

    public clickRow(event, item) {
        this.selectedItems.emit([item]);
        // console.log(this.selectedItems[item]);
    }

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }
}
