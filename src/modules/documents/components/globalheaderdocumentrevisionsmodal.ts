import {Component, ComponentRef, OnInit, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {modellist} from "../../../services/modellist.service";
import {view} from "../../../services/view.service";
import {Observable, Subject, Subscription} from "rxjs";

@Component({
    selector: 'global-header-document-revisions-modal',
    templateUrl: '../templates/globalheaderdocumentrevisionsmodal.html',
    providers: [model, view]
})
export class GlobalHeaderDocumentRevisionsModal implements OnInit {

    public self: ComponentRef<GlobalHeaderDocumentRevisionsModal>;

    public componentconfig: any;
    public relatedRevisions = [];

    constructor(
        public backend: backend,
        public metadata: metadata,
        public model: model,
        public view: view,
    ) {
        this.model.module = 'DocumentRevisions';
        this.model.initialize();
        this.backend.getRequest(`/module/documentrevisions/relatedRevisions/${this.model.data.assigned_user_id}`).subscribe(
            res => {
                this.relatedRevisions = res;
                console.log('Test')

        })

    }


    public ngOnInit() {
        // this.loadRelated();
        // this.model.module = 'DocumentRevisions'
    }

    // public loadRelated(){
    //
    //     this.backend.getRequest('module/documentrevisions/relatedRevisions').subscribe({
    //         next: (beans) => {
                // this.orgunits = beans.orgunits;
                // this.orgcharts = beans.orgcharts;
    //         }}
    //     )
    // }

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }
}
