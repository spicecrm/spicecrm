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
 * @module ModuleEmails
 */
import {Component, Injector, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {metadata} from "../../../services/metadata.service";
import {toast} from "../../../services/toast.service";

@Component({
    selector: "email-schedules-related-modal",
    templateUrl: "./src/modules/emails/templates/emailschedulesrelatedmodal.html",
    providers: [model, view],
})
export class EmailSchedulesRelatedModal {
    /**
     * reference to the modal itsel
     * @private
     */
    private self: any = {};

    /**
     * the currently active tab
     *
     * @private
     */
    private activetab: 'emails' | 'recipients' = 'recipients';

    /**
     * an array for the linked beans
     *
     * @private
     */
    private linkedBeans: any[] = [];

    private modelId: string;
    private currentModule: string;


    constructor(private language: language,
                private model: model,
                @SkipSelf() private parentModel: model,
                private injector: Injector,
                private view: view,
                private modal: modal,
                private metadata: metadata,
                private backend: backend,
                private toast: toast) {

        this.view.isEditable = true;
        this.view.setEditMode();

    }

    /**
     * initalize emailschedules and filter the linkedBeans
     */
    public ngOnInit() {
        // set the module
        this.model.module = "EmailSchedules";
        // initialize the model
        this.model.initialize(this.parentModel);
        this.model.data.parent_id = this.parentModel.id;
        this.model.data.parent_type = this.parentModel.module;
        // start editing
        this.model.startEdit(false);

        this.fiilterProspects();

    }

    /**
     * if the count of the linked beans is equal to 0 it will be disabled and unselectable
     */
    private fiilterProspects() {
        this.linkedBeans = this.linkedBeans.map(link => {
            link.disabled = link.count == 0;
            link.selected = false;
            link.expanded = false;
            return link;
        });
    }

    /**
     * destroy modal instance
     */
    private close() {
        this.self.destroy();
    }

    /**
     * checks that the requirements are met
     */
    get canSchedule() {
        // chek for mailbox and body
        if (!this.model.getField('mailbox_id') || !this.model.getField('email_subject')) return false;

        // have a link selected or linked beans that are not deleted
        if (this.linkedBeans.filter(link => link.selected || (link.linkedbeans && link.linkedbeans.filter(b => !b.deleted).length > 0)).length == 0) return false;

        return true;
    }

    /**
     * save the emailschedule model data, the current bean id, the current bean name, the selected links and send the object to the backend
     */
    private saveSchedule() {
        if (this.canSchedule) {
            this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
                loadingRef.instance.messagelabel = 'LBL_LOADING';
                let selectedLinks = this.linkedBeans.filter(link => link.selected).map(link => link.module);
                let body = {
                    links: selectedLinks,
                    data: this.model.data,
                    linkedbeans: this.linkedbeans
                };
                this.backend.postRequest(`module/EmailSchedules/${this.model.id}/${this.parentModel.module}/${this.parentModel.id}`, {}, body).subscribe(result => {
                    loadingRef.instance.self.destroy();
                    if (result.status) {
                        this.toast.sendToast(this.language.getLabel('MSG_SUCCESSFULLY_EXECUTED'), 'success');
                        this.close();
                    } else {
                        this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                    }
                });

            });
        }
    }

    get linkedbeans(){
        let linked: any = {};
        for(let linkedbean of this.linkedBeans){
            if(!linkedbean.linkedbeans) continue;

            let ids = linkedbean.linkedbeans.filter(b => !b.deleted).map(e => e.id);
            if(ids.length > 0){
                linked[linkedbean.module] = ids;
            }
        }
        return linked;
    }

    private getLinkCount(link) {
        if (link.expanded) return link.linkedbeans ? link.linkedbeans.filter(b => !b.deleted).length : 0;

        // get a total count
        let count = link.selected ? parseInt(link.count, 10) : 0;
        if (link.linkedbeans) count += link.linkedbeans.length;
        return count;
    }

    /**
     * expands the related link and loads the ids
     *
     * @param link
     * @private
     */
    private expandRelated(link) {
        if (!link.expanded) {
            let await = this.modal.await('LBL_LOADING');
            link.selected= false;
            link.expanded = true;
            this.backend.getRequest(`module/${this.parentModel.module}/${this.parentModel.id}/related/${link.link}`, {
                getcount: 0,
                excludeinactive: 1,
                offset: 0,
                limit: 100
            }).subscribe(
                beans => {
                    link.open = true;
                    if (!link.linkedbeans) link.linkedbeans = [];
                    for (let id in beans) {
                        beans[id].source = 'link';
                        beans[id].deleted = false;
                        link.linkedbeans.push(beans[id]);
                    }
                    this.sortLinkedBeans(link);
                    await.emit(true);
                },
                () => {
                    this.toast.sendToast('LBL_ERROR', 'error');
                    await.emit(true);
                }
            );
        } else {
            link.open = !link.open;
        }
    }

    /**
     * opens the select modal to add a bean
     *
     * @param link
     * @private
     */
    private addBean(link) {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = link.module;
            selectModal.instance.multiselect = true;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    link.open = true;
                    if (!link.linkedbeans) link.linkedbeans = [];
                    for (let item of items) {
                        if(link.linkedbeans.findIndex(b => b.id == item.id) == -1) {
                            item.source = 'user';
                            link.linkedbeans.push(item);
                        }
                    }
                    this.sortLinkedBeans(link);
                }
            });
        });
    }

    /**
     * sort by either lastname if set or firstname
     * @param link
     * @private
     */
    private sortLinkedBeans(link) {
        link.linkedbeans.sort((a, b) => a.last_name ? a.last_name.localeCompare(b.last_name) : a.summary_text.localeCompare(b.summary_text));
    }

    /**
     * removes a bean
     *
     * @param link
     * @param index
     * @private
     */
    private removeBean(link, index) {
        if(link.linkedbeans[index].source == 'link') {
            link.linkedbeans[index].deleted = !link.linkedbeans[index].deleted;
        } else {
            link.linkedbeans.splice(index, 1);
        }
    }

}


