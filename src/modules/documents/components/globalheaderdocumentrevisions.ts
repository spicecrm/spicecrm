/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, ElementRef, Injector, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {notification} from "../../../services/notification.service";
import {modal} from "../../../services/modal.service";
import {subscription} from "../../../services/subscription.service";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {session} from "../../../services/session.service";

/**
 * display notifications on the global header
 */
@Component({
    selector: 'global-header-document-revisions',
    templateUrl: '../templates/globalheaderdocumentrevisions.html',
    providers: [model]
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
                public session: session,
                public injector: Injector) {
    }

    public ngOnInit() {
        this.model.module = 'DocumentRevisions';
        this.model.initialize();
        this.loadRelated();
    }


    public loadRelated(){

        this.backend.getRequest(`module/documentrevisions/${this.session.authData.userId}/relateduserrevisions`).subscribe(
            res => {
                this.relatedRevisions = res;
            })
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

    /**
     * a getter to see if the user has subscriptions
     */
    get hasSubscriptions(){
        return this.subscription.subscriptions.length > 0;
    }
}
