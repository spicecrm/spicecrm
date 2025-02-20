/**
 * @module ObjectComponents
 */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    ElementRef,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
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
import {AgreementsAddRevisionModal} from "../../modules/agreements/components/agreementsaddrevisionmodal";

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
export class ObjectRelatedlistFiles implements AfterViewInit, OnDestroy, OnChanges {

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
    public isopen: boolean = false;
    /**
     * holds the selected category value
     * @private
     */
    public selectedCategoryId: string = '';

    /**
     * holds the default category value
     * @private
     */
    public defaultCategoryId: string = '';

    /**
     * subscribe to the broadcast to catch when files list shall be reloaded
     */
    public broadcastSubscription: any = {};

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
     * show or hide folders
     */
    public showFolders: boolean = false;

    /**
     * if configured, limit the file types to be considered on upload
     */
    public fileTypeActionObject: any;

    /**
     * checks if the upload is allowed
     */
    public allowUpload: boolean = true;

    /**
     * file types that are allowed/not allowed
     */
    public fileTypes: string;

    /**
     * message to be displayed based on the configured file types and the action to perform
     */
    public toastMessage: string;

    /**
     * holds the components subscriptions
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public modelattachments: modelattachments,
                public language: language,
                public model: model,
                public renderer: Renderer2,
                public toast: toast,
                public footer: footer,
                public metadata: metadata,
                public backend: backend,
                public broadcast: broadcast,
                public elementRef: ElementRef,
                public configurationService: configurationService,
                public modal: modal,
                public injector: Injector,
                public cdRef: ChangeDetectorRef,
    ) {
        this.broadcastSubscription = this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

        // default category
        if(this.componentconfig.hasOwnProperty('defaultcategory') && this.componentconfig.defaultcategory){
            this.defaultCategoryId = this.componentconfig.defaultcategory;
        }
        // in case no defaultCategoryId is set, load all & display all files
        if(!this.defaultCategoryId && !this.selectedCategoryId) {
            this.selectedCategoryId = '*';
        }

        // if the config exists, limit the file based on it
        this.fileTypeActionObject = this.configurationService.getCapabilityConfig('admin')?.fileTypes;
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        this.setModelData();

        setTimeout(() => this.loadFiles(), 10);

        // subscribe to the broadcast to get a merge notification or reload the file list
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => this.handleMessage(message))
        );

        // subscribe to the folder change
        this.subscriptions.add(
            this.modelattachments.folderId$.subscribe({
                next: () => {
                    this.filteredFiles = this.filterFiles();
                }
            })
        )

        // set to open if we have set to alwysopen per config
        if(this.componentconfig.alwaysExpanded) this.isopen = true;
    }

    /**
     * gets the folder id and consider the root value
     */
    get treeFolder(){
        return this.modelattachments.folderId ?? 'root';
    }

    /**
     * sets the folder id and considers the root value
     *
     * @param folderId
     */
    public  setTreeFolder(folderId){
        this.modelattachments.folderId = folderId == 'root' ? null : folderId;
    }

    public ngOnChanges(changes: SimpleChanges) {

        // default category
        if(this.componentconfig.hasOwnProperty('defaultcategory') && this.componentconfig.defaultcategory){
            this.defaultCategoryId = this.componentconfig.defaultcategory;
        }
        // in case no defaultCategoryId is set, load all & display all files
        if(!this.defaultCategoryId && !this.selectedCategoryId) {
            this.selectedCategoryId = '*';
        }
    }

    /**
     * load categories from backend or from configuration data
      * @private
     */
    public loadCategories() {
        // handle default / selected category
        if(!this.selectedCategoryId && this.defaultCategoryId) {
            this.selectedCategoryId = this.defaultCategoryId;
        }

        // categories
        if (this.configurationService.getData('spiceattachments_categories')) {
            this.categories = this.configurationService.getData('spiceattachments_categories');
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

        // reload file list
        switch (message.messagetype) {
            case 'attachments.loaded':
                // load attachments only, if we are in the same model
                if(message.messagedata.reload && message.messagedata.module == this.model.module && message.messagedata.id == this.model.id) {
                    // open if we have files
                    if(this.modelattachments._files.length > 0) this.isopen = true;
                    // keep closed
                    this.setFilteredFiles('category', this.selectedCategoryId);
                }
                break;
            case 'attachments.cloned':
                // reload files after cloning
                const clonedFiles = message.messagedata.clonedFiles;
                clonedFiles.forEach((item) => {
                    if (!this.filteredFiles.find(a => a.id == item.id)) {
                        this.filteredFiles.push(item);
                        this.cdRef.detectChanges();
                    }
                });
                break;
        }

    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    public loadFiles() {
        // set the name if we have one
        this.modelattachments.name = this.model.getField('summary_text');

        // set input base64 files
        if (this.files.length > 0) {
            this.doupload(this.files);
        }
        this.modelattachments.getAttachments().subscribe(res => {
            this.filteredFiles = res;
            this.loadCategories();
            // reload container
            this.setFilteredFiles('category', this.selectedCategoryId);
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

    get width(){
        return this.elementRef.nativeElement.getBoundingClientRect().width;
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
     * extracts the file types that are configured in the general settings
     * and performs a check if the types are allowed to be uploaded
     * @param filesObject
     * @param files
     */
    public handleConfiguredFileTypesAndActions(filesObject: any, files: File): void {
        let parsedObject = JSON.parse(filesObject);
        const [action, fileTypes] = Object.entries(parsedObject)[0]

        this.fileTypes = String(fileTypes);

        // extract file names
        let fileNames: string[] = [];
        Object.entries(files).forEach(obj => fileNames.push((obj[1]['name'])))

        // extract files that are in the upload process
        let fileTypesToBeUploaded: string[] = [];
        fileNames.forEach(fileName => {
            const extension = fileName.split('.')[1] || 'no-extension';
            fileTypesToBeUploaded.push(extension);
        });

        // reset allowUpload if previously set to false
        this.allowUpload = true;

        // check each file type based on file types that we allow/not allow
        fileTypesToBeUploaded.forEach(file => {
            const isFileIncluded = String(fileTypes).includes(file);

            if (
                (action === 'exclude' && isFileIncluded) ||
                (action === 'include' && !isFileIncluded)
            ) {
                this.allowUpload = false;
                this.toastMessage = `'${fileTypes}' ${this.language.getLabel(
                    action === 'exclude' ? 'LBL_FILETYPES_NOT_ALLOWED' : 'LBL_FILETYPES_ALLOWED'
                )}`;
            }
        });
    }

    /**
     * handle the drop and upload the files
     * @param files
     */
    public fileDrop(files) {
        if(this.componentconfig.disableupload && this.componentconfig.disableupload === true){
            this.toast.sendToast(this.language.getLabel('LBL_UPLOAD_IS_DISABLED'), 'error');
            return false;
        }

        if (this.fileTypeActionObject) {
            this.handleConfiguredFileTypesAndActions(this.fileTypeActionObject, files);
        }

        if (files && files.length >= 1 && this.allowUpload) {
            this.doupload(files);
        } else {
            this.toast.sendToast(this.toastMessage, 'error')
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
     * triggers a file upload. From the select button firing the hidden file upload input
     */
    public addImage() {
        this.modal.openModal('SpiceAttachmentAddImageModal', true, this.injector);
    }

    /**
     * does the upload oif the files
     */
    public uploadFile() {
        let files = this.fileupload.element.nativeElement.files;

        if (this.fileTypeActionObject) {
            this.handleConfiguredFileTypesAndActions(this.fileTypeActionObject, files);
        }

        if(this.allowUpload) {
            this.doupload(files);
        } else {
            this.toast.sendToast(this.toastMessage, 'error');
        }
    }

    /**
     * the upload itself
     *
     * @param files an array with files
     */
    public doupload(files) {
        if (this.componentconfig.revComponent) {
            if (files.length != 1) {
                this.toast.sendToast(this.language.getLabel('LBL_ONE_FILE_ONLY'), 'error');
                return false;
            }
        }

        // handle default / selected category
        if(!this.selectedCategoryId && this.defaultCategoryId) {
            this.selectedCategoryId = this.defaultCategoryId;
        }

        this.modelattachments.uploadAttachmentsBase64(files, (this.selectedCategoryId == '*' ? this.defaultCategoryId : this.selectedCategoryId)).subscribe({
            next: (res) => {
                if (this.componentconfig.revComponent) {
                    this.openRevisionModal(files);
                }
            },
            error: () => {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }

    /**
     *
     * @param files
     * opens AgreementsRevisionModal
     * used only in Agreements Module
     */
    public openRevisionModal(files) {
        let loadingModal = this.modal.await(this.language.getLabel('LBL_LOADING'));
        this.backend.getRequest('common/spiceattachments/module/' + this.model.module + '/' + this.model.id).subscribe(result => {
            loadingModal.emit(true);
            if (result) {
                this.modal.openModal('AgreementsAddRevisionModal', true, this.injector).subscribe(
                    (modalRef: ComponentRef<AgreementsAddRevisionModal>) => {
                        modalRef.instance.files = files;
                        modalRef.instance.revComponent = this.componentconfig;
                        modalRef.instance.spiceattachment = files[0];

                        modalRef.instance.responseSubject.subscribe({
                            next: res => {
                                if (!res) return;
                                this.toast.sendToast('MSG_REVISION_CREATED', 'success');
                                // re-initialize modelattachments model for Agreements
                                this.setModelData();
                            }
                        })
                    }
                );
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
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
                this.filteredFiles = this.filterFiles();
                break;
            case 'input':
                const term = value.toLowerCase();
                this.filterTerm = value;
                window.clearTimeout(this.filterTimeout);
                this.filterTimeout = window.setTimeout(() => {
                    this.filteredFiles = this.filterFiles();
                }, 600);
        }
    }

    /**
     * return the filtered files
     * @private
     */
    private filterFiles(){
        let filteredFiles = this.modelattachments.files;

        if(this.selectedCategoryId){
            filteredFiles = (this.selectedCategoryId == '*' || !this.selectedCategoryId) ? filteredFiles : filteredFiles
                .filter(file => !!file.category_ids && file.category_ids.includes(this.selectedCategoryId));
        }

        if(this.filterTerm){
            const term = this.filterTerm.toLowerCase();
            filteredFiles = term.length == 0 ? filteredFiles : filteredFiles
                .filter(file => file.filename.toLowerCase().includes(term) || (!!file.display_name && file.display_name.toLowerCase().includes(term)) || (!!file.text && file.text.toLowerCase().includes(term)));
        }

        return /*this.showFolders ? filteredFiles.filter(f => f.file_mime_type != 'folder') : */  filteredFiles;
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

    public toggleFolders(){
        this.showFolders = !this.showFolders;
        this.filteredFiles = this.filterFiles();
    }

    /**
     * make sure on destroy to unsubscribe from the broadcast
     */
    public ngOnDestroy() {
        this.broadcastSubscription.unsubscribe();
    }

    /**
     * adds a folder
     */
    public addFolder(){
        this.modal.prompt('input', null, 'LBL_FOLDER_NAME').subscribe({
            next: (foldername) => {
                if(foldername){
                    this.modelattachments.createFolder(foldername).subscribe({
                        next: (folderID) => {
                            this.modelattachments.folderId = folderID;
                            // this.filteredFiles = this.filterFiles();
                        }
                    });
                }
            }
        })
    }
}
