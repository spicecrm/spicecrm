/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, ElementRef, Injector, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {notification} from "../../../services/notification.service";
import {modal} from "../../../services/modal.service";
import {subscription} from "../../../services/subscription.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";

/**
 * display notifications on the global header
 */
@Component({
    selector: 'global-header-document-revisions',
    templateUrl: '../templates/globalheaderdocumentrevisions.html',
    providers: [model],
    standalone: false
})
export class GlobalHeaderDocumentRevisions implements OnInit {

    public relatedRevisions = [];

    constructor(public notificationService: notification,
                public elementRef: ElementRef,
                public modal: modal,
                public viewContainerRef: ViewContainerRef,
                public model: model,
                public subscription: subscription,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2,
                public backend: backend,
                public injector: Injector) {
    }

    public ngOnInit() {
        this.model.module = 'DocumentRevisions';
        this.model.initialize();
        this.loadRelated();
    }


    public loadRelated(){
        if(this.model.data.assigned_user_id){
            this.backend.getRequest(`module/DocumentRevisions/unread/foruser`).subscribe(
                res => {
                    this.relatedRevisions = res;
                    if(this.relatedRevisions.length > 0){
                        this.openModal();
                    }
                })
        }
    }

    /**
     * toggle open popover
     */
    public openModal() {
        this.modal.openModal( 'GlobalHeaderDocumentRevisionsModal', true, this.injector).subscribe(modalRef => {
                modalRef.instance.relatedRevisions = this.relatedRevisions;
            }
        );
    }
}
