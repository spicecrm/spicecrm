/**
 * @module ModuleActivities
 */
import {Component, ElementRef, OnInit, Renderer2, OnDestroy, SkipSelf} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {relateFilter} from "../../../services/interfaces.service";
import {navigation} from "../../../services/navigation.service";

@Component({
    templateUrl: '../templates/fieldactivityparticipationpanel.html'
})
export class fieldActivityParticipationPanel extends fieldGeneric implements OnInit, OnDestroy  {

    /**
     * the index of the type of lookup (index of the aray above
     */
    public lookupType: any = {};
    /**
     * listens to the click
     */
    public clickListener: any;

    /**
     * indicate tha the typoe selector is open
     */
    public lookuplinkSelectOpen: boolean = false;

    public possibleLinks: any[] = [
        {
            name: 'contacts',
            module: 'Contacts',
            id: 'contact_id'
        },
        {
            name: 'users',
            module: 'Users',
            id: 'user_id'
        },
        {
            name: 'employees',
            module: 'Employees',
            id: 'employee_id'
        },
        {
            name: 'leads',
            module: 'Leads',
            id: 'lead_id'
        }
    ]

    public participantLinks: any[] = []

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

    /**
     * set to never dispolay the assigned user in the table
     */
    public displayAssignedUser: true;

    /**
     * the fieldset for the table
     */
    public fieldset: string;

    /**
     * a relateFilter
     */
    public relateFilter: relateFilter;

    constructor(public model: model,
                public view: view,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal,
                private navigation: navigation) {

        super(model, view, language, metadata, router);

        // filter by available modules and dynamically build the linkname
        this.participantLinks = this.possibleLinks.filter(p => {
            return this.metadata.getModuleDefs(p.module);
        }).map(l => {
            l.link = this.model.module.toLowerCase() + '_' + l.name
            return l;
        });

        // set the first as selected type
        if(this.participantLinks.length > 0) this.lookupType = this.participantLinks[0];

        // subscriber to the broadcast when new model is added from the model
        this.subscriptions.add(this.broadcast.message$.subscribe((message) => this.handleMessage(message)));

        // subscribe to model $data and build the participants .. replacing the setter
        this.subscriptions.add(this.model.data$.subscribe(modelData => {

            // set the participants
            this.setParticipants();

            // update the relate filter
            this.updateRelateFilter();
        }));
    }


    get relateFilterActive() {
        return this.lookupType.module != 'Users';
    }

    /**
     * load the links and the table fieldset
     */
    public ngOnInit() {


        // set the primary on new meetings
        this.setPrimary();

        // set the participants
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
    public handleRelateFIlterField() {
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

    private setPrimary(){
        if(this.model.isNew){
            for(let pl of this.participantLinks){
                let defaultID = this.model.getField(pl.id);
                if(defaultID){
                    let beanData = this.navigation.getRegisteredModel(defaultID, pl.module);
                    if(beanData) {
                        if (!this.model.data[pl.name]) this.model.data[pl.name] = {beans: {}};
                        this.model.data[pl.name].beans[defaultID] = beanData.data;
                    }
                    break;
                }
            };
        }
    }

    /**
     * initially loads the participants .. also listens to model chanmges (noit fired bny the field
     */
    public setParticipants() {
        for (let pl of this.participantLinks) {
            if (this.model.data[pl.name] && this.model.data[pl.name].beans) {
                //  if (this.model.data[lookupModule.toLowerCase()] && this.model.data[lookupModule.toLowerCase()].beans) {
                for (let beanid in this.model.data[pl.name].beans) {
                    let bean = this.model.data[pl.name].beans[beanid];

                    // special handling for assigned user
                    if (pl.module == 'Users' && !this.displayAssignedUser && beanid == this.model.data.assigned_user_id) {
                        continue;
                    }

                    // check if we have the record already
                    let index = this.participants.findIndex(participant => participant.id == bean.id);
                    if (index < 0) {
                        // push to the participants
                        this.participants.push({
                            module: pl.module,
                            id: bean.id,
                            data: bean,
                            link: pl.link
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
    public addItem(item) {
        if (!this.model.data[ this.lookupType.name]) this.model.data[this.lookupType.name] = {beans: {}};

        this.model.data[this.lookupType.name].beans[item.id] = item.data;

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
     * closes all open dropdowns
     */
    public closePopups() {
        this.lookupSearchOpen = false;
        this.lookuplinkSelectOpen = false;

        this.clickListener();
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

        if (!this.model.data[participant.link].beans_relations_to_delete) this.model.data[participant.link].beans_relations_to_delete = {};
        this.model.data[participant.link].beans_relations_to_delete[participant.id] = participant;
        delete (this.model.data[participant.link].beans[participant.id]);

        // remove th pill
        this.participants = this.participants.filter(item => item.id != participant.id);
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
     * opens the separate search modal
     */
    public searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal) => {
            selectModal.instance.module = this.lookupType.module;
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
