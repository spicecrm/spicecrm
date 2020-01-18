/**
 * @module ModuleActivities
 */
import {Component, ElementRef, Renderer2, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {broadcast} from '../../../services/broadcast.service';
import {modal} from '../../../services/modal.service';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

@Component({
    templateUrl: './src/modules/activities/templates/fieldactivityparticipationpanel.html'
})
export class fieldActivityParticipationPanel extends fieldGeneric implements OnInit {

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
     * the participants to be displayed. Loaded initially and then handled by the field itself
     */
    private participants: any[] = [];

    /**
     * the fieldset for the table
     */
    private fieldset: string;

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

        // build the lookup links
        this.lookuplinks = this.getLookuplinks();

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe((message) => this.handleMessage(message));

        // subscribe to model $data and build the participants .. replacing the setter
        this.model.data$.subscribe(modelData => {
            this.setParticipants();
        });
    }

    /**
     * load the links and the table fieldset
     */
    public ngOnInit() {
        if(!this.fieldconfig.fieldset){
            this.fieldset = this.metadata.getComponentConfig('fieldActivityParticipationPanel').fieldset;
        } else {
            this.fieldset = this.fieldconfig.fieldset;
        }
    }

    get displayAssignedUser() {
        return false;
    }

    /**
     * returns the name for the link resp the module
     */
    get lookupTypeName() {
        return this.language.getModuleName(this.lookuplinks[this.lookupType].module);
    }

    /**
     * loads the links from the config
     *
     * fallback to the metadata
     */
    private getLookuplinks(): any[] {
        let linknames: string[] = ['contacts', 'users'];
        let links = [];
        for (let linkname of linknames) {
            links.push({name: linkname, module: this.metadata.getFieldDefs(this.model.module, linkname).module});
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
     * removes on of the participants linked
     * @param item the pill item
     */
    private removeItem(participant) {
        if (!this.model.data[participant.link].beans_relations_to_delete) this.model.data[participant.link].beans_relations_to_delete = {};
        this.model.data[participant.link].beans_relations_to_delete[participant.id] = participant;
        delete (this.model.data[participant.link].beans[participant.id]);

        // remove th pill
        let index = this.participants.findIndex(pill => pill.id == participant.id);
        this.participants.splice(index, 1);
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


}
