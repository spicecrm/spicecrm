/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SpiceBCardReaderModule
 */
import {Component, Self, SkipSelf, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from "../../../services/model.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {backend} from "../../../services/backend.service";
import {Observable, Subject} from "rxjs";
import {metadata} from "../../../services/metadata.service";
import {modal} from "../../../services/modal.service";

@Component({
    templateUrl: './src/include/spicebcardreader/templates/spicebcardreaderbutton.html',
    providers: [modelattachments, model],
})

export class SpiceBCardReaderButton {

    @ViewChild("fileupload", {read: ViewContainerRef, static: true}) private fileupload: ViewContainerRef;

    constructor(private modelattachments: modelattachments,
                private language: language,
                private metadata: metadata,
                private modal: modal,
                @Self() private newModel: model,
                @SkipSelf() private model: model,
                private backend: backend) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    public execute() {
        let mouseEvent = new MouseEvent("click", {bubbles: false});
        this.fileupload.element.nativeElement.dispatchEvent(mouseEvent);
    }

    /*
     * @set phones from vcard tel
     * @param fields
     * @return phones: object
     */
    protected getNewModelPhone(fields) {
        let phones: any = {};
        phones.phone_work = fields.tel[0].value[0];
        phones.phone_home = fields.tel[1] ? fields.tel[1].value[0] : '';
        phones.phone_mobile = fields.tel[2] ? fields.tel[2].value[0] : '';
        phones.phone_other = fields.tel[3] ? fields.tel[3].value[0] : '';
        return phones;
    }

    /*
     * @set fullname from vcard n
     * @param fields
     * @return fullName: object
     */
    protected getNewModelFullName(fields) {
        let fullName: any = {};
        fullName.last_name = fields.n[0].value[0] || '';
        fullName.first_name = fields.n[0].value[1] || '';
        fullName.salutation = fields.n[0].value[2] || '';
        fullName.degree1 = fields.n[0].value[3] || '';
        fullName.degree2 = fields.n[0].value[4] || '';
        return fullName;
    }

    /*
     * @set addresses from vcard adr
     * @param fields
     * @return addresses: object
     */
    protected getNewModelAddresses(fields) {
        let addresses: any = {};
        if (fields.adr && fields.adr[0]) {
            addresses.primary_address_pobox = fields.adr[0].value[0] || '';
            addresses.primary_address_attn = fields.adr[0].value[1] || '';
            addresses.primary_address_street = fields.adr[0].value[2] || '';
            addresses.primary_address_city = fields.adr[0].value[3] || '';
            addresses.primary_address_postalcode = fields.adr[0].value[5] || '';
            addresses.primary_address_country = fields.adr[0].value[6] || '';
        }
        if (fields.adr && fields.adr[1]) {
            addresses.alt_address_pobox = fields.adr[1].value[0] || '';
            addresses.alt_address_attn = fields.adr[1].value[1] || '';
            addresses.alt_address_street = fields.adr[1].value[2] || '';
            addresses.alt_address_city = fields.adr[1].value[3] || '';
            addresses.alt_address_postalcode = fields.adr[1].value[5] || '';
            addresses.alt_address_country = fields.adr[1].value[6] || '';
        }
        return addresses;
    }

    /*
     * does the upload of the files
     */
    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        if (files.length == 1) this.doUpload(files[0]);
        this.fileupload.element.nativeElement.value = '';
    }

    /**
     * stop propagation on the field clicl
     * @param event
     */
    private uploadclick(event) {
        event.stopPropagation();
    }

    /*
     * the upload itself
     * @param file
     */
    private doUpload(file) {
        this.newModel.module = this.model.module;
        this.newModel.id = this.newModel.generateGuid();
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = 'LBL_PROCESSING';
            this.getFileContent(file).subscribe(fileContent => {
                let cardFile = {
                    file: fileContent,
                    filemimetype: file.type,
                    filename: file.name
                };
                this.backend.postRequest(`cardreader/processBusinessCard`, '', {card: cardFile})
                    .subscribe(res => {
                        loadingModalRef.instance.self.destroy();
                        if (res && res.vcard) {
                            this.newModel.addModel('', null, this.getNewModelPresets(res.vcard));
                        }
                    });
            });
        });
    }

    /*
     * @set newModel.presets from vcard
     * @param vcard: string
     */
    private getNewModelPresets(vcard) {
        let fields = this.parseVCard(vcard);
        let newModelPresets: any = {};
        let newModelFields = this.metadata.getModuleFields(this.newModel.module);
        if (newModelFields.first_name && newModelFields.last_name && fields.n && fields.n.length > 0) {
            newModelPresets = {...newModelPresets, ...this.getNewModelFullName(fields)};
        }
        if ((newModelFields.email_addresses || newModelFields.emailaddresses) && fields.email && fields.email.length > 0) {
            newModelPresets.emailaddresses = this.getNewModelEmailAddresses(fields);
        }
        if ((newModelFields.primary_address_street || newModelFields.alt_address_street) && fields.adr && fields.adr.length > 0) {
            newModelPresets = {...newModelPresets, ...this.getNewModelAddresses(fields)};
        }
        if (newModelFields.title && fields.title && fields.title.length > 0) {
            newModelPresets.title = fields.title[0].value[0];
        }
        if ((newModelFields.phone_home || newModelFields.phone_mobile ||
            newModelFields.phone_other || newModelFields.phone_work) && fields.title && fields.title.length > 0) {
            newModelPresets = {...newModelPresets, ...this.getNewModelPhone(fields)};
        }
        return newModelPresets;
    }

    /*
     * @set emailAddresses from vcard email
     * @param fields
     * @return emailAddresses: object
     */
    private getNewModelEmailAddresses(fields) {
        let emailAddresses = [];
        fields.email.forEach(email => {
            let counter = 0;
            while (counter < email.value.length) {
                emailAddresses.push(
                    {
                        id: '',
                        email_address_id: '',
                        primary_address: emailAddresses.length == 0 ? '1' : '0',
                        email_address: email.value[0].toLowerCase(),
                        email_address_caps: email.value[0].toUpperCase()
                    }
                );
                counter++;
            }
        });
        return emailAddresses;
    }

    /*
     * @read file
     * @param file
     * @return observable: fileContentBase64
     */
    private getFileContent(file): Observable<any> {
        let responseSubject = new Subject<any>();
        let reader: any = new FileReader();
        reader.file = file;
        reader.onloadend = () => {
            let filecontent = reader.result.toString();
            filecontent = filecontent.substring(filecontent.indexOf('base64,') + 7);
            responseSubject.next(filecontent);
            responseSubject.complete();
        };
        reader.readAsDataURL(file);
        return responseSubject.asObservable();
    }

    /*
     * @parse vcard
     * @param input: string
     * @return fields: object
     */
    private parseVCard(input) {
        let Re1 = /^(version|fn|title|org):(.+)$/i;
        let Re2 = /^([^:;]+);([^:]+):(.+)$/;
        let ReKey = /item\d{1,2}\./;
        let fields: any = {};

        input.split(/\r\n|\r|\n/).forEach((line) => {
            let results, key;

            if (Re1.test(line)) {
                results = line.match(Re1);
                key = results[1].toLowerCase();
                fields[key] = results[2];
            } else if (Re2.test(line)) {
                results = line.match(Re2);
                key = results[1].replace(ReKey, '').toLowerCase();

                let meta = {};
                results[2].split(';')
                    .map((p, i) => {
                        let match = p.match(/([a-z]+)=(.*)/i);
                        if (match) {
                            return [match[1], match[2]];
                        } else {
                            return ["TYPE" + (i === 0 ? "" : i), p];
                        }
                    })
                    .forEach((p) => {
                        meta[p[0]] = p[1];
                    });

                if (!fields[key]) fields[key] = [];

                fields[key].push({
                    meta: meta,
                    value: results[3].split(';')
                });
            }
        });

        return fields;
    }
}
