/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    Renderer2,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";
import {modelurls} from "../../services/modelurls.service";
import {footer} from "../../services/footer.service";
import {broadcast} from "../../services/broadcast.service";
import {Subscription} from "rxjs";

/**
 * a generic component that renders a panel in the context of a model.
 * This allows uploading urls and also has a drag and drop functionality to simply drop urls over the component and upload the url
 */
@Component({
    selector: "object-related-list-urls",
    templateUrl: "../templates/objectrelatedlisturls.html",
    providers: [modelurls],
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
        trigger('animateicon', [
            state('open', style({transform: 'scale(1, 1)'})),
            state('closed', style({transform: 'scale(1, -1)'})),
            transition('open => closed', [
                animate('.5s'),
            ]),
            transition('closed => open', [
                animate('.5s'),
            ])
        ]),
        trigger('displaycard', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ])
    ]
})
export class ObjectRelatedListUrls implements AfterViewInit, OnDestroy {

    /**
     * an object array with base64 urls
     */
    public urls: any[] = [];

    /**
     * the urlupload element
     */
    @ViewChild("urlupload", {read: ViewContainerRef, static: true}) public urlupload: ViewContainerRef;

    /**
     * keeps if the modal is open or not
     */
    public isopen: boolean = true;

    /**
     * passed in component config
     */
    @Input() public componentconfig: any = {};

    /**
     * subscribe to the broadcast to catch when urls list shall be reloaded
     */
    public broadcastSubscription: any = {};

    /**
     * holds the components subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public modelurls: modelurls,
                public language: language,
                public model: model,
                public renderer: Renderer2,
                public toast: toast,
                public footer: footer,
                public broadcast: broadcast,
                public elementRef: ElementRef,
    ) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });
    }

    /**
     * gets width
     */
    get width() {
        return this.elementRef.nativeElement.getBoundingClientRect().width;
    }

    /**
     * sets model data
     * loads urls
     * @ignore
     */
    public ngAfterViewInit() {
        this.setModelData();
        setTimeout(() => this.loadUrls(), 10);

        // subscribe to the broadcast to get a notification or reload the url list
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => this.handleMessage(message))
        );
    }

    /**
     * handle message:
     * if the model has been merged
     * if urls should be reloaded
     *
     * @param message
     * @private
     */
    public handleMessage(message: any) {
        if (message.messagetype == 'model.merge' && message.messagedata.module == this.model.module && message.messagedata.id == this.model.id) {
            this.loadUrls();
        }
        // reload file list
        switch (message.messagetype) {
            case 'urls.loaded':
                if (message.messagedata.reload) {
                    this.urls = this.modelurls.urls;
                }
                break;
        }
    }

    /**
     * initializes the model urls service and loads the urls
     */
    public loadUrls() {
        this.modelurls.getUrls().subscribe(res => {
            this.urls = res;
        });
    }

    /**
     * sets model und id
     */
    public setModelData() {
        this.modelurls.module = this.model.module;
        this.modelurls.id = this.model.id;
    }

    /**
     * toggle open and closed .. called from teh template button
     */
    public toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this.isopen = !this.isopen;
    }

    /**
     * handle the drop and upload the urls
     * upload itself
     * @param dataTransfer items
     */
    public urlDrop(dataTransfer: any) {
        if (this.componentconfig.disableupload && this.componentconfig.disableupload === true) {
            this.toast.sendToast(this.language.getLabel('LBL_UPLOAD_IS_DISABLED'), 'error');
            return false;
        }

        // holds url string i.e. https://www.spicecrm.com/
        const urlString = dataTransfer.getData("URL");
        if (urlString) this.modelurls.prepareUrlForSave(urlString)
    }

    /**
     * triggers a url upload. From the select button firing the hidden url upload input
     */
    public selectUrl() {
        let event = new MouseEvent("click", {bubbles: true});
        this.urlupload.element.nativeElement.dispatchEvent(event);
    }

    /**
     * make sure on destroy to unsubscribe from the broadcast
     */
    public ngOnDestroy() {
        this.broadcastSubscription.unsubscribe();
    }

}
