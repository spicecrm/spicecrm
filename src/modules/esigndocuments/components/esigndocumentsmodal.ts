/**
 * @module ObjectComponents
 */
import {
    Component,
    ElementRef,
    Input, OnDestroy, OnInit,
    Renderer2,
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {outputModalService} from "../../outputtemplates/services/outputmodal.service";
import {modelutilities} from '../../../services/modelutilities.service';
import {relateFilter} from "../../../services/interfaces.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    templateUrl: '../templates/esigndocumentsmodal.html',
    providers: [view, outputModalService],
    animations: [
        trigger('slideInOut', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '100%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
        trigger('slideInOut2', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '0%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
    ]
})
export class ESignDocumentsModal extends fieldGeneric implements OnInit, OnDestroy {

    public modalTitle: string;

    public forcedFormat: 'html' | 'pdf';

    public contentForHandBack: string;

    /**
     * if true send the bean data to the backend to handle live compiling the template content
     */
    public liveCompile: boolean = false;

    /**
     * the window itsel .. resp the containing modal container
     */
    public self: any = undefined;

    /**
     * the list of templates
     */
    public templates = [];

    /**
     * the selected output format
     */

    /**
     * flag is the oputput is loading
     */
    public loading_output: boolean = false;

    /**
     * expanded email-content flag
     */
    public expanded: boolean = false;

    /**
     * flag is the send is loading
     */
    public loading_send_button: boolean = false;

    /**
     * the selected output format
     */
    public _selected_format: 'html' | 'pdf' = 'pdf';

    /**
     * the component config
     * @private
     */
    public componentsetId: string;

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    public blobUrl: any;

    /**
     * the index of the type of lookup (index of the aray above
     */
    public lookupType = 0;
    /**
     * listens to the click
     */
    public clickListener: any;
    /**
     * the links that can be selected with the lookup
     */
    public lookuplinks = [];
    /**
     * indicate tha the typoe selector is open
     */
    public lookuplinkSelectOpen: boolean = false;

    /**
     * indicates that the search box is open
     */
    public lookupSearchOpen: boolean = false;

    /**
     * the uiser search term
     */
    public lookupSearchTerm: string = '';

    /**
     * the participants to be displayed. Loaded initially and then handled by the field itself
     */
    public participants: any[] = [];
    public relatedParticipants: any[] = [];

    /**
     * the fieldset for the table
     */
    public fieldset: string;

    /**
     * a relateFilter
     */
    public relateFilter: relateFilter;


    /**
     * the fielsname
     */
    @Input() public fieldname: string = '';


    /**
     * the fieldconfig .. typically passed in from the fieldset
     */
    @Input() public fieldconfig: any = {};


    /**
     * additonal classes top be added when the field is displayed
     */
    @Input() public fielddisplayclass: string = '';

    /**
     * a unique id that is issued in the constructor
     */
    public fieldid: string = '';

    /**
     * the max length of the field
     */
    public fieldlength: number = 999;

    /**
     * holds any subscription a field might have
     */
    public subscriptions: Subscription = new Subscription();

    public timeoutHandle: any

    constructor(
        public language: language,
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public view: view,
        public backend: backend,
        public outputModalService: outputModalService,
        public sanitizer: DomSanitizer,
        public modelutilities: modelutilities,
        public router: Router,
        public elementRef: ElementRef,
        public renderer: Renderer2
    ) {
        super(model, view, language, metadata, router);
        this.fieldid = this.model.generateGuid();
    }

    public ngOnInit() {

        this.loading_send_button = false
        this.setModalData();

        // build the lookup links
        this.lookuplinks = this.getLookuplinks();

        if (this.relatedParticipants.length > 0) {
            this.relatedParticipants.map(participant => {
                this.participants.push({
                    status: true,
                    module: 'Contacts',
                    link: 'contatcs',
                    id: participant.id,
                    data: participant
                });
            })
        }

        this.rendertemplate();
        if (!this.fieldconfig.fieldset) {
            this.fieldset = this.metadata.getComponentConfig('fieldActivityParticipationPanel').fieldset;
        } else {
            this.fieldset = this.fieldconfig.fieldset;
        }

        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        if (fieldDefs && fieldDefs.len) {
            this.fieldlength = fieldDefs.len;
        }

        // create the relate filter
        if (this.fieldconfig.relatefilterfield) {
            this.createRelateFilter();
        }

        let componentconfig = this.metadata.getComponentConfig('ESignDocumentsModal', this.model.module);
        this.componentsetId = componentconfig.componentset;


    }

    /**
     * If there is no modal window title given from outside, use the default title
     * If there is no button text given from outside, use the default text
     * Set the output format in case it is given from outside
     */
    public setModalData() {
        if (!this.modalTitle) this.modalTitle = this.language.getLabel(this.language.getLabel('LBL_ESIGN_DOCUMENTS'));
        if (this.forcedFormat) this._selected_format = this.forcedFormat;
    }

    /**
     * backend call to render the template and return the content
     */
    public rendertemplate() {
        this.loading_output = true;
        const body = {
            contacts: this.participants,
            bean_data: this.liveCompile ? this.modelutilities.spiceModel2backend(this.model.module, this.model.data) : null
        };

        this.backend.postRequest(`module/esigndocuments/${this.model.data.outputtemplate_id}/compiler/${this.model.data.id}/to/pdf`, null, body).subscribe({
                next: (pdf: any) => {
                    let blob = this.datatoBlob(atob(pdf.content));
                    this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
                    this.contentForHandBack = pdf.content;

                    this.participants = this.participants.filter(item => item.status);
                    this.loading_output = false;
                    this.loading_send_button = true
                },
                error: (err: any) => {
                    console.error(err)
                    this.loading_output = false;
                    this.loading_send_button = true
                }
            }
        );
    }

    /**
     * called from reload button to re render the template
     */
    public reload() {
        this.rendertemplate();
    }

    /**
     * close the modal
     */
    public close() {
        this.outputModalService.modalResponse$.next('close');
        this.outputModalService.modalResponse$.complete();

        this.self.destroy();
    }

    /**
     * send document to docusign and save external_id
     */
    public sendESignDocument() {
        const loading = this.modal.await('LBL_LOADING');

        const docId = (Math.random() * (99 - 1) + 1).toFixed(0);
        const envelopeId = this.model.generateGuid();

        let data = {
            documents: {
                file_data: this.contentForHandBack,
                file_name: envelopeId,
                file_id: docId,
                status: 'sent',
                type: 'pdf',
                emailSubject: this.model.data.outputtemplate_name
            },
            parent_id: this.model.id,
            parent_type: this.model.module,
            template_id: this.model.data.outputtemplate_id,
            participants: this.participants,
            id: envelopeId
        }

        this.backend.save('ESignDocuments', envelopeId, data).subscribe({
            next: (res: any) => {
                loading.next(true);
                loading.complete();
                this.close();
            },
            error: (err: any) => {
                loading.next(true);
                loading.complete();
                console.error(err);
            }
        })
    }

    /**
     * a setter for the data
     *
     * @param data the raw data of the object being passed in. When the data is pased in the bloburl is created
     */
    set data(data) {
        let blob = this.datatoBlob(data);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    }

    /**
     * internal function to translate the data to a BLOL URL
     *
     * @param byteCharacters the file data
     * @param contentType the type
     * @param sliceSize optional parameter to change performance
     */
    public datatoBlob(byteCharacters, contentType = '', sliceSize = 512) {
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    /**
     * returns the name for the link resp the module
     */
    get lookupTypeName() {
        return this.language.getModuleName(this.lookuplinks[this.lookupType]?.module);
    }

    get relateFilterActive() {
        return this.lookuplinks[this.lookupType]?.module != 'Users';
    }

    /**
     * creates the relate filter for the list service
     */
    public createRelateFilter() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldconfig.relatefilterfield);
        if (fieldDefs) {
            let module = fieldDefs.type == 'parent' ? this.model.getField(fieldDefs.type_name) : fieldDefs.module;
            this.relateFilter = {
                module: module,
                relationship: this.fieldconfig.relatefilterrelationship,
                id: this.model.getField(fieldDefs.id_name),
                display: this.model.getField(this.fieldconfig.relatefilterfield),
                active: this.model.getField(fieldDefs.id_name) ? true : false,
                required: false
            };
        }
    }

    /**
     * removes the relate filter
     */
    public removeRelateFilter() {
        this.relateFilter = undefined;
    }

    /**
     * updates the relate filter
     */
    public updateRelateFilter() {
        if (this.relateFilterActive) {
            let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldconfig.relatefilterfield);
            if (fieldDefs) {
                this.relateFilter.id = this.model.getField(fieldDefs.id_name);
                this.relateFilter.display = this.model.getField(this.fieldconfig.relatefilterfield);

                // toggle the active flag
                this.relateFilter.active = !!this.relateFilter.id ? true : false;
            }
        }
    }

    /**
     * loads the links from the config
     *
     * fallback to the metadata
     */
    public getLookuplinks(): any[] {

        let linknames: string[] = [];
        if (this.fieldconfig.linknames) {
            linknames = this.fieldconfig.linknames.split(',');
        }
        if (linknames.length == 0) {
            linknames = ['contacts', 'users', 'consumers'];
        }
        let links = [];
        for (let linkname of linknames) {
            linkname = linkname.trim();
            let module = this.metadata.getFieldDefs(this.model.module, linkname)?.module;
            if (module && this.metadata.moduleDefs[module]) {
                links.push({name: linkname, module: module});
            }
        }
        return links;
    }

    /**
     * adds an item from the search
     *
     * @param item
     */
    public addItem(item) {

        // check if we have the record already
        let index = this.participants.findIndex(participant => participant.id == item.id);
        if (index < 0) {
            // push to the participants

            this.participants.push({
                status: true,
                module: 'Contacts',
                link: 'contatcs',
                id: item.id,
                data: item
            });
            this.rendertemplate();
        }
        // close the lookup
        this.lookupSearchOpen = false;


    }

    /**
     * message handler listening to the broadcast and adding the reference when a model is added from one of the dialogs and has the refrerence to the field
     * ToDo: this shoudl be replaced by a chained suibscribe
     *
     * @param message
     */
    public handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // clear the searchterm
                        this.lookupSearchTerm = '';

                        // set the model
                        this.addItem({id: message.messagedata.data.id, text: message.messagedata.data.summary_text});
                    }
                    break;
            }
        }
    }

    /**
     * opens or closes the type selector
     */
    public toggleLookupTypeSelect() {
        this.lookuplinkSelectOpen = !this.lookuplinkSelectOpen;
        this.lookupSearchOpen = false;
    }

    /**
     * sets the type selected from the type dropdown
     *
     * @param lookupType the index in the array
     */
    public setLookupType(lookupType) {
        this.lookupSearchTerm = '';
        this.lookupType = lookupType;
        this.lookuplinkSelectOpen = false;

        if (this.relateFilterActive) {
            this.createRelateFilter();

        } else {
            this.removeRelateFilter();
        }

    }

    /**
     * removes on of the participants linked
     * @param participant the pill item
     */
    public removeItem(participant) {
        this.loading_send_button = false
        this.participants.map(p => {
            if (p.id === participant.id) {
                p.status = false
            }
        })

        window.clearTimeout(this.timeoutHandle);
        this.timeoutHandle = window.setTimeout(() => {
            this.rendertemplate();
        }, 1500);
    }

    /**
     * opens the search dropdown when the input gets the focus
     */
    public onFocus() {
        this.openSearchDropDown();
    }

    /*
    * opens the search dropdown
     */
    public openSearchDropDown() {
        // this.getRecent();
        this.lookuplinkSelectOpen = false;
        this.lookupSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    /**
     * click handler for the
     * @param event
     */
    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    /**
     * closes all open dropdowns
     */
    public closePopups() {
        this.lookupSearchOpen = false;
        this.lookuplinkSelectOpen = false;

        this.clickListener();
    }

    /**
     * opens the separate search modal
     */
    public searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal) => {
            selectModal.instance.module = this.lookuplinks[this.lookupType].module;
            selectModal.instance.multiselect = false;

            // set the relate filter if we have one
            if (this.relateFilter) {
                selectModal.instance.relatefilter = this.relateFilter;
            }


            selectModal.instance.selectedItems.subscribe((items) => {

                this.addItem(items[0]);
            });
            selectModal.instance.usedSearchTerm.subscribe(term => {
                this.lookupSearchTerm = term;
            });
            selectModal.instance.searchTerm = this.lookupSearchTerm;
        });
    }

    /**
     * @unsubscribe subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
