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
 * @module ObjectComponents
 */
import {Component, AfterViewInit, OnInit, OnDestroy, Input, ChangeDetectorRef} from "@angular/core";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {Subscription} from "rxjs";

declare var _: any;

/**
 * a generic component for a related list.
 *
 * gets extended in the various subpanel implementations
 */
@Component({
    selector: "object-related-list",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlist.html",
    providers: [relatedmodels]
})
export class ObjectRelatedList implements OnInit {

    /**
     * the componentconfig
     */
    @Input() public componentconfig: any = {};

    /**
     * the listfields
     */
    private listfields: any[] = [];

    /**
     * can hold a separate editcomponentset if the editing modal shoudl be specifically configured
     */
    private editcomponentset: string = "";

    /**
     * if set to true no actions are displayed in the table lines
     */
    private hideactions: boolean = false;

    /**
     * a load subscription that awaitsa the model to be loaded before triggering the load of the subpanels
     *
     * @private
     */
    private loadsubscription: Subscription = new Subscription();

    private loaded: boolean = false;

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
        public cdref: ChangeDetectorRef
    ) {

    }

    /**
     * check if we can list and also if the user has access to the link field
     * the link field can be disabled using the field control in the acl object
     * if the link field is turned off .. the acl access is not granted
     */
    get aclAccess() {
        let linkField = this.relatedmodels.linkName != "" ? this.relatedmodels.linkName : this.relatedmodels.relatedModule.toLowerCase();
        return (this.metadata.checkModuleAcl(this.relatedmodels.relatedModule, "listrelated") || this.metadata.checkModuleAcl(this.relatedmodels.relatedModule, "list")) && this.model.checkFieldAccess(linkField);
    }

    /**
     * laod config, initialize the related model service and load the related records
     */
    public ngOnInit() {
        // loads the config
        this.loadConfig();

        // Initialize the related Model Service
        this.initializeRelatedModelService();

        this.loadsubscription = this.model.data$.subscribe(modeldata => {
            this.loadRelated();
        });

    }

    /**
     * loads the list fields from the componentconfig
     */
    private loadConfig() {
        let fieldset = this.componentconfig.fieldset;
        this.listfields = this.metadata.getFieldSetFields(fieldset);

        // check for a separate componentconfig
        if (this.componentconfig.editcomponentset) this.editcomponentset = this.componentconfig.editcomponentset;

        // determines if the action shoudl be hidden
        this.hideactions = !!this.componentconfig.hideactions;
    }

    /**
     * initializes the related model service
     */
    private initializeRelatedModelService() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;

        // pass in the model
        this.relatedmodels.model = this.model;

        // set the related model from teh config
        this.relatedmodels.relatedModule = this.componentconfig.object;

        // check if we have a separate link or even an EndPoint
        if (this.componentconfig.linkEndPoint) {
            this.relatedmodels.linkEndPoint = this.componentconfig.linkEndPoint;
        } else if (this.componentconfig.link) {
            this.relatedmodels.linkName = this.componentconfig.link;
        }

        // check if we have a sequence field and thus the list shoudl be sequenced
        if (this.componentconfig.sequencefield) {
            this.relatedmodels.sequencefield = this.componentconfig.sequencefield;
        } else if (this.relatedmodels._linkName && this.model.fields[this.relatedmodels._linkName] && this.model.fields[this.relatedmodels._linkName].sequence_field) {
            this.relatedmodels.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }

        // set an optional sortfield
        if (this.componentconfig.sortfield) {
            this.relatedmodels.sort.sortfield = this.componentconfig.sortfield;
            this.relatedmodels.sort.sortdirection = this.componentconfig.sortdirection ? this.componentconfig.sortdirection : "ASC";
        }

        // set the numbe rof items to be laoded
        if (this.componentconfig.items) this.relatedmodels.loaditems = this.componentconfig.items;

        // set the modulefilter if one is set
        if (this.componentconfig.modulefilter) this.relatedmodels.modulefilter = this.componentconfig.modulefilter;
    }


    /**
     * checks the model state if a requiredmodelstate is set in the componentconfig
     */
    public checkModelState() {
        if (this.componentconfig.requiredmodelstate && (_.isEmpty(this.model.data) || !this.model.checkModelState(this.componentconfig.requiredmodelstate))) {
            return false;
        }

        // by default return true
        return true;
    }


    /**
     * loads the related records
     */
    public loadRelated() {
        if (this.loaded || !this.aclAccess || (this.componentconfig.requiredmodelstate && !this.checkModelState())) return;

        this.loaded = true;

        // unsubscribe if we loaded once
        this.loadsubscription.unsubscribe();

        this.relatedmodels.getData();
    }

    /**
     * returns if the table shoudl allow edit
     */
    get editable() {
        try {
            return this.componentconfig.editable && this.model.checkAccess('edit');
        } catch (e) {
            return false;
        }
    }

    /**
     * adds selected items fromt he popup
     * @param items
     */
    public addSelectedItems(items) {
        this.relatedmodels.addItems(items);
    }

    /**
     * returns the listitemactionset if one is defined
     */
    get listitemactionset() {
        return this.componentconfig && this.componentconfig.listitemactionset ? this.componentconfig.listitemactionset : '';
    }
}
