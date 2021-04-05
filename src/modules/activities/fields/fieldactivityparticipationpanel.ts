/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleActivities
 */
import {Component, ElementRef, OnInit, Renderer2, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {relateFilter} from "../../../services/modellist.service";

@Component({
    templateUrl: './src/modules/activities/templates/fieldactivityparticipationpanel.html'
})
export class fieldActivityParticipationPanel extends fieldGeneric implements OnInit, OnDestroy  {

    /**
     * the index of the type of lookup (index of the aray above
     */
    public lookupType = 0;
    /**
     * listens to the click
     */
    private clickListener: any;
    /**
     * the links that can be selected with the lookup
     */
    private lookuplinks = [];
    /**
     * indicate tha the typoe selector is open
     */
    private lookuplinkSelectOpen: boolean = false;

    /**
     * indicates that the search box is open
     */
    private lookupSearchOpen: boolean = false;

    /**
     * the uiser search term
     */
    private lookupSearchTerm: string = '';

    /**
     * the participants to be displayed. Loaded initially and then handled by the field itself
     */
    private participants: any[] = [];

    /**
     * set to never dispolay the assigned user in the table
     */
    private displayAssignedUser: true;

    /**
     * the fieldset for the table
     */
    private fieldset: string;

    /**
     * a relateFilter
     */
    private relateFilter: relateFilter;

    constructor(public model: model,
                public view: view,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal) {

        super(model, view, language, metadata, router);



        // subscriber to the broadcast when new model is added from the model
        this.subscriptions.add(this.broadcast.message$.subscribe((message) => this.handleMessage(message)));

        // subscribe to model $data and build the participants .. replacing the setter
        this.subscriptions.add(this.model.data$.subscribe(modelData => {
            if(this.lookuplinks.length > 0) {
                // set the participants
                this.setParticipants();
            }
            // update the relate filter
            this.updateRelateFilter();
        }));
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
     * load the links and the table fieldset
     */
    public ngOnInit() {
        // build the lookup links
        this.lookuplinks = this.getLookuplinks();
        this.setParticipants();

        if (!this.fieldconfig.fieldset) {
            this.fieldset = this.metadata.getComponentConfig('fieldActivityParticipationPanel').fieldset;
        } else {
            this.fieldset = this.fieldconfig.fieldset;
        }

        // create the relate filter
        if (this.fieldconfig.relatefilterfield) {
            this.createRelateFilter();
        }
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
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
     * checks if we have a relate filter field and if yes sets the filter accordingly
     */
    private handleRelateFIlterField() {
        // check if we have a relate filter in the fieldconfig
        if (this.fieldconfig.relatefilterfield) {
            this.createRelateFilter();
            this.subscriptions.add(
                this.model.data$.subscribe(data => {
                    this.updateRelateFilter();
                })
            );
        }
    }

    /**
     * creates the relate filter for the list service
     */
    private createRelateFilter() {
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
    private removeRelateFilter() {
        this.relateFilter = undefined;
    }

    /**
     * updates the relate filter
     */
    private updateRelateFilter() {
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
    private getLookuplinks(): any[] {

        let linknames: string[] = [];
        if(this.fieldconfig.linknames) {
            linknames = this.fieldconfig.linknames.split(',');
        }
        if(linknames.length == 0) {
            linknames = ['contacts', 'users', 'consumers'];
        }
        let links = [];
        for (let linkname of linknames) {
            linkname = linkname.trim();
            if(this.metadata.getFieldDefs(this.model.module, linkname)) {
                links.push({name: linkname, module: this.metadata.getFieldDefs(this.model.module, linkname).module});
            }
        }
        return links;
    }

    /**
     * initially loads the participants .. also listens to model chanmges (noit fired bny the field
     */
    private setParticipants() {
        for (let lookuplink of this.lookuplinks) {
            if (this.model.data[lookuplink.name] && this.model.data[lookuplink.name].beans) {
                //  if (this.model.data[lookupModule.toLowerCase()] && this.model.data[lookupModule.toLowerCase()].beans) {
                for (let beanid in this.model.data[lookuplink.name].beans) {
                    let bean = this.model.data[lookuplink.name].beans[beanid];

                    // special handling for assigned user
                    if (lookuplink.module == 'Users' && !this.displayAssignedUser && beanid == this.model.data.assigned_user_id) {
                        continue;
                    }

                    // check if we have the record already
                    let index = this.participants.findIndex(participant => participant.id == bean.id);
                    if (index < 0) {
                        // push to the participants
                        this.participants.push({
                            module: lookuplink.module,
                            id: bean.id,
                            data: bean,
                            link: lookuplink.name
                        });
                    }
                }
            }
        }
    }

    /**
     * adds an item from the search
     *
     * @param item
     */
    private addItem(item) {
        if (!this.model.data[this.lookuplinks[this.lookupType].name]) this.model.data[this.lookuplinks[this.lookupType].name] = {beans: {}};

        this.model.data[this.lookuplinks[this.lookupType].name].beans[item.id] = item.data;

        // close the lookup
        this.lookupSearchOpen = false;

        // set the participants
        this.setParticipants();
    }

    /**
     * message handler listening to the broadcast and adding the reference when a model is added from one of the dialogs and has the refrerence to the field
     * ToDo: this shoudl be replaced by a chained suibscribe
     *
     * @param message
     */
    private handleMessage(message: any) {
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
     * closes all open dropdowns
     */
    private closePopups() {
        this.lookupSearchOpen = false;
        this.lookuplinkSelectOpen = false;

        this.clickListener();
    }

    /**
     * opens or closes the type selector
     */
    private toggleLookupTypeSelect() {
        this.lookuplinkSelectOpen = !this.lookuplinkSelectOpen;
        this.lookupSearchOpen = false;
    }

    /**
     * sets the type selected from the type dropdown
     *
     * @param lookupType the index in the array
     */
    private setLookupType(lookupType) {
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
    private removeItem(participant) {

        if (!this.model.data[participant.link].beans_relations_to_delete) this.model.data[participant.link].beans_relations_to_delete = {};
        this.model.data[participant.link].beans_relations_to_delete[participant.id] = participant;
        delete (this.model.data[participant.link].beans[participant.id]);

        // remove th pill
        this.participants = this.participants.filter(item => item.id != participant.id);
    }

    /**
     * opens the search dropdown when the input gets the focus
     */
    private onFocus() {
        this.openSearchDropDown();
    }


    /*
    * opens the search dropdown
     */
    private openSearchDropDown() {
        // this.getRecent();
        this.lookuplinkSelectOpen = false;
        this.lookupSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    /**
     * opens the separate search modal
     */
    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal) => {
            selectModal.instance.module = this.lookuplinks[this.lookupType].module;
            selectModal.instance.multiselect = false;

            // set the relate filter if we have one
            if (this.relateFilter) {
                selectModal.instance.relatefilter = this.relateFilter;
            }


            selectModal.instance.selectedItems.subscribe((items) => {
                this.addItem({id: items[0].id, text: items[0].summary_text, data: items[0]});
            });
            selectModal.instance.usedSearchTerm.subscribe(term => {
                this.lookupSearchTerm = term;
            });
            selectModal.instance.searchTerm = this.lookupSearchTerm;
        });
    }


}
