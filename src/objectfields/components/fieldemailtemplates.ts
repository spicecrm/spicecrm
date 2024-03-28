/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {configurationService} from '../../services/configuration.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router} from '@angular/router';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {fieldGeneric} from "./fieldgeneric";
import {SystemLoadingModal} from "../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'field-email-templates',
    templateUrl: '../templates/fieldemailtemplates.html'
})
export class fieldEmailTemplates extends fieldGeneric implements OnInit {

    public isLoaded: boolean = false;
    public availableTemplates: any[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public backend: backend,
        public modal: modal,
        public configuration: configurationService
    ) {
        super(model, view, language, metadata, router);
    }

    get subjectField() {
        return this.fieldconfig.subject ? this.fieldconfig.subject : 'name';
    }

    get bodyField() {
        return this.fieldconfig.body ? this.fieldconfig.body : 'body';
    }

    get addtocurrentquote() {
        return this.fieldconfig.addtocurrentquote == true ? true : false;
    }


    get isDisabled() {
        return !this.model.getFieldValue('parent_type') || this.model.getFieldValue('parent_type') == '' || !this.isLoaded ? true : false || this.availableTemplates.length == 0;
    }

    public getValue() {
        for (let template of this.availableTemplates) {
            if (template.id == this.value) {
                return template.name;
            }
        }
    }

    /**
     * get the templates for the bean
     *
     * ToDo: swicth to separate route without the old filter style
     */
    public ngOnInit() {

        let emailTemplates = this.configuration.getData('EmailTemplates');
        if ( emailTemplates && !this.fieldconfig?.ignoreCache ) {
            this.availableTemplates = emailTemplates.filter(et => et.type == 'email' && (et.for_bean == '*' || et.for_bean == this.model.getFieldValue('parent_type')));
            this.availableTemplates.sort((a, b) =>  a.name.localeCompare(b.name));
            this.isLoaded = true;
        } else {
            let params = {
                start: 0,
                limit: 500,
                listid: 'all'
            };
            this.backend.getRequest('module/EmailTemplates', params).subscribe(
                (data: any) => {
                    // set the templates
                    this.configuration.setData('EmailTemplates', data.list);

                    // set the templates internally
                    this.availableTemplates = data.list.filter(et => et.type == 'email' && (et.for_bean == '*' || et.for_bean == this.model.getFieldValue('parent_type')));
                    this.availableTemplates.sort((a, b) =>  a.name.localeCompare(b.name));
                    this.isLoaded = true;
                }
            );
        }
    }

    /**
     * fires when the template is selected and triggers the parser
     *
     * @param event
     */
    public chooseTemplate(event) {
        if (this.value != '') {
            this.modal.openModal('SystemLoadingModal', false).subscribe(modalRef => {
                this.backend.getRequest('module/EmailTemplates/' + this.value + '/parse/' + this.model.getFieldValue('parent_type') + '/' + this.model.getFieldValue('parent_id')).subscribe((data: any) => {
                    // nur überschreiben wenn nicht bereits ein subject angegeben wurde.
                    if (!this.model.getField(this.subjectField)) {
                        this.model.setField(this.subjectField, data.subject);
                    }

                    // create a new document to manage the current html string (body)
                    let virtualDocument = document.implementation.createHTMLDocument("Virtual Document");
                    virtualDocument.documentElement.innerHTML = this.model.getFieldValue(this.bodyField);

                    let selectedEleTemp = virtualDocument.querySelectorAll("div[data-spice-temp-quote]");
                    let selectedEleSign = virtualDocument.querySelectorAll("div[data-signature]");
                    let selectedEleReply = virtualDocument.querySelectorAll("div[data-spice-reply-quote]");

                    selectedEleTemp[0]?.parentNode.removeChild(selectedEleTemp[0]);

                    let newBody = [
                        '<div class="spicecrm_temp_quote">' + data.body_html + '</div>',
                        selectedEleSign[0]?.outerHTML,
                        selectedEleReply[0]?.outerHTML
                    ].join("<p><br></p>");

                    this.model.setField(this.bodyField, newBody);

                    modalRef.instance.self.destroy();
                });
            });
        } else {
            this.model.setField(this.bodyField, '');
        }
    }
}
