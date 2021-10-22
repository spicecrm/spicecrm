/**
 * @module ObjectComponents
 */
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {layout} from "../../../services/layout.service";
import {backend} from "../../../services/backend.service";
import {trigger, transition, animate, style, state} from '@angular/animations';
import {ServiceDocSignatureContent} from "./servicedocsignaturecontent";

@Component({
    selector: 'service-docs-signature-modal',
    templateUrl: './src/modules/servicecomponents/templates/servicedocsignaturemodal.html',
    providers: [view],
    animations: [
        trigger('slideInOut', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '100%'})),
            state('open_mobile', style({width: '0%'})),
            state('closed_mobile', style({width: '100%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ]),
            transition('open_mobile <=> closed_mobile', [
                animate('200ms'),
            ])
        ]),
        trigger('slideInOut2', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '0%'})),
            state('open_mobile', style({width: '100%'})),
            state('closed_mobile', style({width: '0%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ]),
            transition('open_mobile <=> closed_mobile', [
                animate('200ms'),
            ])
        ]),
    ]
})
export class ServiceDocSignatureModal {


    /**
     * this is the child component (the email content )
     */
    // @ViewChild(ObjectActionOutputBeanModalEmailContent, {static: true}) public emailContent;
    @ViewChild(ServiceDocSignatureContent) public signatureContent: ServiceDocSignatureContent;

    public modalTitle: string;
    public forcedFormat: 'html'|'pdf';
    public noDownload = false;
    public handBack: EventEmitter<any>;
    public buttonText: string;
    private contentForHandBack: string;
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
    private templates = [];

    /**
     * the selected template
     */
    private _selected_template = null;

    /**
     * the selected output format
     */
    private _selected_format: 'html' | 'pdf' = 'pdf';

    /**
     * the response of the compiler
     */
    private compiled_selected_template: string = '';

    /**
     * flag is the oputput is loading
     */
    private loading_output: boolean = false;



    /**
     * fieldset
     */
    private fieldset: string = '';

    /**
     * the pdf file
     */
    public file: File;

    /**
     * flag to show the email-content
     */
    private showsendemail: boolean = true;
    /**
     * expanded content status
     */
    private expanded: string = "open";
    /**
     * expanded content flag
     */
    private mobile: boolean = false;

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    private blobUrl: any;

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata,
        private modal: modal,
        private view: view,
        private backend: backend,
        private sanitizer: DomSanitizer,
        private cdRef: ChangeDetectorRef,
        private viewContainerRef: ViewContainerRef,
        private layout: layout
    ) {
        // get the fieldset of the email area
        let componentconfig = this.metadata.getComponentConfig('ServiceDocSignatureModal', this.model.module);
        this.fieldset = componentconfig.fieldset;

        // set the animation info
        this.mobile = this.layout.screenwidth != 'large';
        this.expanded = 'open' + this.mobile? '_mobile':'';
    }

    public ngOnInit() {
        this.setModalData();
        this.setSelectedTemplate();

        // if no template is set and we only have one select this
        if (!this.selected_template && this.templates.length == 1) {
            this.selected_template = this.templates[0];
            this.rendertemplate();
        }
    }

    /**
     * If there is no modal window title given from outside, use the default title
     * If there is no button text given from outside, use the default text
     * Set the output format in case it is given from outside
     */
    private setModalData() {
        if ( !this.modalTitle ) this.modalTitle = this.language.getLabel(this.language.getLabel('LBL_SIGN'));
        if ( !this.buttonText ) this.buttonText = this.language.getLabel( this.noDownload  ? 'LBL_OK':'LBL_DOWNLOAD' );
        if ( this.forcedFormat ) this._selected_format = this.forcedFormat;
    }

    /**
     * see if we have a relate to an output template
     */
    private setSelectedTemplate() {
        let fields = this.metadata.getModuleFields(this.model.module);
        for (let field in fields) {
            if (fields[field].type == 'relate' && fields[field].module == 'OutputTemplates') {
                let template = this.templates.find(template => template.id == this.model.getFieldValue(fields[field].id_name));
                if(template) {
                    this.selected_template = template;
                }
                break;
            }
        }
    }

    set selected_template(val) {
        this._selected_template = val;
        this.rendertemplate();
    }

    get selected_template() {
        return this._selected_template;
    }

    get selected_format(): 'pdf' | 'html' {
        return this._selected_format;
    }

    set selected_format(format) {
        this._selected_format = format;
        this.expanded = 'closed' + this.mobile? '_mobile':'';
        this.rendertemplate();
    }

    get sanitizedTemplated() {
        return this.sanitizer.bypassSecurityTrustHtml(this.compiled_selected_template);
    }

    /**
     * backend call to render the template and return the content
     */
    private rendertemplate() {
        this.loading_output = true;

        this.blobUrl = null;
        this.compiled_selected_template = null;

        switch (this.selected_format) {
            case 'pdf':
                const body = {bean_data: this.liveCompile ? this.model.data : null};

                this.backend.postRequest(`module/OutputTemplates/${this.selected_template.id}/convert/${this.model.id}/to/pdf/base64`, null, body).subscribe(
                    pdf => {
                        let blob = this.datatoBlob( atob( pdf.content ) );
                        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl( URL.createObjectURL( blob ) );
                        this.contentForHandBack = pdf.content;
                        this.loading_output = false;
                    },
                    err => {
                        this.loading_output = false;
                    }
                );
                break;
            case 'html':
                // compile the template to show the user...
                this.backend.getRequest(`module/OutputTemplates/${this.selected_template.id}/compile/${this.model.id}`).subscribe(
                    res => {
                        this.compiled_selected_template = res.content;
                        this.contentForHandBack = res.content;
                        this.loading_output = false;
                    },
                    err => {
                        this.loading_output = false;
                    }
                );
                break;
        }
    }

    /**
     * called from reload button to re render the template
     */
    private reload() {
        this.rendertemplate();
    }

    private close() {
        this.self.destroy();
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
    private datatoBlob(byteCharacters, contentType = '', sliceSize = 512) {
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

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    /**
     * open/close content
     */
    private openContentArea() {
        if(this.expanded == 'closed' || this.expanded == 'closed_mobile') {
            this.expanded = 'open' + (this.mobile? '_mobile':'');
        } else {
            this.expanded = 'closed' + (this.mobile? '_mobile':'');
        }
    }

    /**
     * call the child method that will send the mail
     */
    private saveSignature() {
        this.signatureContent.saveSignature();
    }

    private onAnimationDone() {
        this.cdRef.detectChanges();
    }
}
