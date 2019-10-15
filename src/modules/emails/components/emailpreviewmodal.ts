/**
 * @module SystemComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modelattachments} from '../../../services/modelattachments.service';

/**
 * a modal that renders and provides a preview for an object
 */
@Component({
    templateUrl: './src/modules/emails/templates/emailpreviewmodal.html',
    providers: [model, view]
})
export class EmailPreviewModal implements OnInit {

    /**
     * reference to the modal itself
     */
    private self: any = {};

    /**
     * the type of the object that will be passed in
     */
    @Input() private type: string = '';

    /**
     * the name of the object. This is displayed in the header
     */
    @Input() private name: string = '';

    /**
     * the id of the attachment for the email
     */
    private file: any;

    /**
     * the fieldset to be rendered
     */
    private fieldset: string;

    /**
     * if the email is beiong loaded
     */
    private isLoading: boolean = true;

    constructor(private language: language, private metadata: metadata, private sanitizer: DomSanitizer, private backend: backend, private model: model, private view: view, private modelattachments: modelattachments) {
        this.model.module = 'Emails';

        let componentConfig = this.metadata.getComponentConfig('EmailPreviewModal', this.model.module);
        this.fieldset = componentConfig.fieldset;
    }

    /**
     * handles closing the modal
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * a setter for the data
     *
     * @param data the raw data of the object being passed in. When the data is pased in the bloburl is created
     */
    public ngOnInit() {
        this.backend.getRequest('module/Emails/msg/' + this.file.id + '/preview').subscribe(response => {
            this.model.setFields(this.model.utils.backendModel2spice('Emails', response));
            this.isLoading = false;
        });
    }

    private download(){
        this.modelattachments.downloadAttachment(this.file.id, this.file.filename);
    }

}
