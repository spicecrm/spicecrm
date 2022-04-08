/**
 * @module ObjectComponents
 */
import {AfterViewInit, Component, Input, Renderer2, ViewChild, ViewContainerRef} from "@angular/core";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {modal} from "../../services/modal.service";
import {configurationService} from "../../services/configuration.service";
import {backend} from "../../services/backend.service";
import {broadcast} from "../../services/broadcast.service";
import {Subscription} from "rxjs";

/**
 * a generic component that renders a panel in teh contect of a model. This allows uploading files and also has a drag and drop functionality to cimply drop files over the component and upload the file
 */
@Component({
    selector: "object-relatedlist-files",
    templateUrl: "../templates/objectrelatedlistfiles.html",
    providers: [modelattachments],
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
export class ObjectRelatedlistFiles implements AfterViewInit {

    /**
     * an object array with base64 files
     */
    @Input() public files: any[] = [];
    /**
     * holds the filtered files list
     * @private
     */
    public filteredFiles: any[] = [];
    /**
     * the fileupload elelent
     */
    @ViewChild("fileupload", {read: ViewContainerRef, static: true}) public fileupload: ViewContainerRef;
    /**
     * @ignore
     *
     * passed in component config
     */
    @Input() public componentconfig: any = {};
    /**
     * @ignore
     *
     * keeps if the modal is open or not
     */
    public isopen: boolean = true;
    /**
     * holds the selected category value
     * @private
     */
    public selectedCategoryId: string = '';
    /**
     * holds the filter term for files
     * @private
     */
    public filterTerm: string = '';
    /**
     * holds the available categories
     * @private
     */
    public categories: any[] = [];
    /**
     * holds the search timeout
     * @private
     */
    public filterTimeout: number;

    /**
     * holds the components subscriptions
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param language
     * @param model
     * @param renderer
     * @param toast
     * @param footer
     * @param metadata
     * @param backend
     * @param configurationService
     * @param modalservice
     */
    constructor(public modelattachments: modelattachments,
                public language: language,
                public model: model,
                public renderer: Renderer2,
                public toast: toast,
                public footer: footer,
                public metadata: metadata,
                public backend: backend,
                public broadcast: broadcast,
                public configurationService: configurationService,
                public modalservice: modal) {
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        this.setModelData();
        setTimeout(() => this.loadFiles(), 10);

        // subscribe to the braidcast to get a merge notification
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => this.handleMessage(message))
        );

    }

    /**
     * load categories from backend or from configuration data
      * @private
     */
    public loadCategories() {
        if (!!this.configurationService.getData('spiceattachments_categories')) {
            return this.categories = this.configurationService.getData('spiceattachments_categories');
        }
        this.backend.getRequest('common/spiceattachments/categories/' + this.model.module).subscribe(res => {
            if (!res || !Array.isArray(res)) return;
            this.categories = res;
            this.configurationService.setData('spiceattachments_categories', res);
        });
    }

    /**
     * handle merge message and if the model has beenmerged reload the attachments
     *
     * @param message
     * @private
     */
    public handleMessage(message: any) {
        if(message.messagetype == 'model.merge' && message.messagedata.module == this.model.module && message.messagedata.id == this.model.id){
            this.loadFiles();
        }
    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    public loadFiles() {
        // set input base64 files
        if (this.files.length > 0) {
            this.doupload(this.files);
        }
        this.modelattachments.getAttachments().subscribe(res => {
            this.filteredFiles = res;
            this.loadCategories();
        });
    }

    public setModelData() {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    /**
     * toggle open and closed .. called from teh template button
     */
    public toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this.isopen = !this.isopen;
    }

    /**
     * handler for the dragover event.- Checks if we only have files dragged over the div
     *
     * @param event
     */
    public preventdefault(event: any) {
        if ((event.dataTransfer.items.length >= 1 && this.hasOneItemsFile(event.dataTransfer.items)) || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();

            // ensure we are copying the element
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    /**
     * helper to check if all elements of the drag over event are files
     *
     * @param items the items from the event
     */
    public hasOneItemsFile(items) {
        for (let item of items) {
            if (item.kind == 'file') {
                return true;
            }
        }

        return false;
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    public onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    public fileDrop(files) {
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * triggers a file upload. From the select button firing the hidden file upload input
     */
    public selectFile() {
        let event = new MouseEvent("click", {bubbles: true});
        this.fileupload.element.nativeElement.dispatchEvent(event);
    }

    /**
     * does the upload oif the files
     */
    public uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    /**
     * the upload itself
     *
     * @param files an array with files
     */
    public doupload(files) {
        this.modelattachments.uploadAttachmentsBase64(files);
    }

    /**
     * set filtered files by action
     * @param action
     * @param value
     * @private
     */
    public setFilteredFiles(action: string, value: string) {
        switch (action) {
            case 'category':
                this.selectedCategoryId = value;
                this.filteredFiles = value == '*' ? this.modelattachments.files : this.modelattachments.files
                    .filter(file => !!file.category_ids && file.category_ids.includes(value));
                break;
            case 'input':
                const term = value.toLowerCase();
                this.filterTerm = value;

                window.clearTimeout(this.filterTimeout);
                this.filterTimeout = window.setTimeout(() => {
                    this.filteredFiles = value.length == 0 ? this.modelattachments.files : this.modelattachments.files
                        .filter(file => file.filename.toLowerCase().includes(term) || (!!file.display_name && file.display_name.toLowerCase().includes(term)) || (!!file.text && file.text.toLowerCase().includes(term)));
                }, 600);
        }
    }

    /**
     * toggle big thumbnail value
     */
    public toggleBigThumbnail() {
        if (!this.componentconfig) {
            this.componentconfig = {};
        }
        this.componentconfig.bigThumbnail = !this.componentconfig.bigThumbnail;
    }
}
