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
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'field-lookup',
    templateUrl: './src/objectfields/templates/fieldlookup.html'
})
export class fieldLookup extends fieldGeneric implements OnInit {

    /**
     * listens to the click
     */
    private clickListener: any;

    /**
     * the links that can be selected with the lookup
     */
    private lookuplinks = [];

    /**
     * the index of the type of lookup (index of the aray above
     */
    public lookupType = 0;

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
     * the pills to be displayed. Loaded initially and then handled by the field itself
     */
    private pills: any[] = [];

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
        this.broadcast.message$.subscribe((message) => this.handleMessage(message));

        // subscribe to model $data and build the pills .. replacing the setter
        this.model.data$.subscribe(modelData => {
            this.setPills();
        });
    }

    /**
     * load the links
     */
    public ngOnInit() {
        this.lookuplinks = this.getLookuplinks();
    }

    get displayAssignedUser() {
        return this.fieldconfig.displayassigneduser;
    }

    /**
     * returns the name for the link resp the module
     */
    get lookupTypeName() {
        return this.language.getModuleName(this.lookuplinks[this.lookupType].module);
    }

    /**
     * is only needed when no definition by this.fieldconfig.lookuplinks
     */
    private getLookupmodules(): string[] {
        let modules: string[];
        if (this.fieldconfig.lookupmodules) modules = this.fieldconfig.lookupmodules.replace(/\s/g, '').split(',');
        if (!modules) modules = ['Contacts', 'Users'];  // default, when no modules (and no links) are defined in this.fieldconfig.lookuplinks
        return modules;
    }

    /**
     * loads the links from the config
     *
     * fallback to the metadata
     */
    private getLookuplinks(): any[] {
        let linknames: string[];
        if (this.fieldconfig.lookuplinks) linknames = this.fieldconfig.lookuplinks.replace(/\s/g, '').split(',');
        if (!linknames) {  // fallback
            linknames = [];
            for (let module of this.getLookupmodules()) linknames.push(module.toLowerCase());
        }
        let links = [];
        for (let linkname of linknames) {
            links.push({name: linkname, module: this.metadata.getFieldDefs(this.model.module, linkname).module});
        }
        return links;
    }

    /**
     * initially loads the pills .. also listens to model chanmges (noit fired bny the field
     */
    private setPills() {
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
                    let index = this.pills.findIndex(pill => pill.id == bean.id);
                    if (index < 0) {
                        // push to the pills
                        this.pills.push({
                            module: lookuplink.module,
                            id: bean.id,
                            summary_text: bean.summary_text,
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

        this.model.data[this.lookuplinks[this.lookupType].name].beans[item.id] = {
            id: item.id,
            summary_text: item.text
        };

        // close the lookup
        this.lookupSearchOpen = false;

        // set the pills
        this.setPills();
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
    }

    /**
     * removes on of the pills linked
     * @param item the pill item
     */
    private removeItem(item) {
        if (!this.model.data[item.link].beans_relations_to_delete) this.model.data[item.link].beans_relations_to_delete = {};
        this.model.data[item.link].beans_relations_to_delete[item.id] = item;
        delete (this.model.data[item.link].beans[item.id]);

        // remove th pill
        let index = this.pills.findIndex(pill => pill.id == item.id);
        this.pills.splice(index, 1);
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
            selectModal.instance.selectedItems.subscribe((items) => {
                this.addItem({id: items[0].id, text: items[0].summary_text, data: items[0]});
            });
            selectModal.instance.usedSearchTerm.subscribe(term => {
                this.lookupSearchTerm = term;
            });
            selectModal.instance.searchTerm = this.lookupSearchTerm;
        });
    }

    /**
     * trackby function for the pills to imporve rendering and performance
     *
     * @param pill
     */
    private pillid(pill) {
        return pill.id;
    }

}
