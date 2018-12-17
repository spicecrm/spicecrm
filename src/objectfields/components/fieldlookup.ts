import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'field-lookup',
    templateUrl: './src/objectfields/templates/fieldlookup.html',
    providers: [popup]
})
export class fieldLookup extends fieldGeneric implements OnInit {

    private clickListener: any;
    private lookupType = 0;
    private lookuplinkSelectOpen: boolean = false;
    private lookupSearchOpen: boolean = false;
    private lookupSearchTerm: string = '';
    private lookuplinks = [];

    constructor(public model: model,
                public view: view,
                public popup: popup,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private modal: modal) {
        super(model, view, language, metadata, router);

        // subscribe to the popup handler
        this.popup.closePopup$.subscribe(() => this.closePopups());

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe((message) => this.handleMessage(message));
    }

    public ngOnInit() {
        this.lookuplinks = this.getLookuplinks();
    }

    get displayAssignedUser() {
        return this.fieldconfig.displayassigneduser;
    }

    get lookupTypeName() {
        return this.language.getModuleName(this.lookuplinks[this.lookupType].module);
    }

    // getLookupmodules() is only needed when no definition by this.fieldconfig.lookuplinks
    private getLookupmodules(): string[] {
        let modules: string[];
        if (this.fieldconfig.lookupmodules) modules = this.fieldconfig.lookupmodules.replace(/\s/g, '').split(',');
        if (!modules) modules = ['Contacts', 'Users'];  // default, when no modules (and no links) are defined in this.fieldconfig.lookuplinks
        return modules;
    }

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

    get pills() {
        let pills = [];
        for (let lookuplink of this.lookuplinks) {
            if (this.model.data[lookuplink.name] && this.model.data[lookuplink.name].beans) {
                //  if (this.model.data[lookupModule.toLowerCase()] && this.model.data[lookupModule.toLowerCase()].beans) {
                for (let beanid in this.model.data[lookuplink.name].beans) {
                    let bean = this.model.data[lookuplink.name].beans[beanid];

                    // special handling for assigned user
                    if (lookuplink.module == 'Users' && !this.displayAssignedUser && beanid == this.model.data.assigned_user_id) {
                        continue;
                    }

                    // pus to the pills
                    pills.push({
                        module: lookuplink.module,
                        id: bean.id,
                        summary_text: bean.summary_text,
                        link: lookuplink.name
                    });
                }
            }
        }
        return pills;
    }


    private addItem(item) {
        if (!this.model.data[this.lookuplinks[this.lookupType].name]) this.model.data[this.lookuplinks[this.lookupType].name] = {beans: {}};

        this.model.data[this.lookuplinks[this.lookupType].name].beans[item.id] = {
            id: item.id,
            summary_text: item.text
        };
    }

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

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private closePopups() {
        this.lookupSearchOpen = false;
        this.lookuplinkSelectOpen = false;

        this.clickListener();
    }

    private toggleLookupTypeSelect() {
        this.lookuplinkSelectOpen = !this.lookuplinkSelectOpen;
        this.lookupSearchOpen = false;
    }

    private setLookupType(lookupType) {
        this.lookupSearchTerm = '';
        this.lookupType = lookupType;
        this.lookuplinkSelectOpen = false;
    }

    private removeItem(item) {
        if (!this.model.data[item.link].beans_relations_to_delete) this.model.data[item.link].beans_relations_to_delete = {};
        this.model.data[item.link].beans_relations_to_delete[item.id] = item;
        delete(this.model.data[item.link].beans[item.id]);
    }

    private onFocus() {
        this.openSearchDropDown();
    }

    private onFieldClick() {
        this.openSearchDropDown();
    }

    private openSearchDropDown() {
        // this.getRecent();
        this.lookuplinkSelectOpen = false;
        this.lookupSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private parentSearchStyle() {
        if (this.lookupSearchOpen) {
            return {
                display: 'block'
            };
        }
    }

    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal) => {
            selectModal.instance.module = this.lookupTypeName;
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
