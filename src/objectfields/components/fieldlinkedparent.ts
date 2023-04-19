/**
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';
import {modal} from '../../services/modal.service';


@Component({
    selector: 'field-linked-parent',
    templateUrl: '../templates/fieldlinkedparent.html'
})
export class fieldLinkedParent extends fieldGeneric implements OnInit {
    public clickListener: any;

    public parentTypeSelectOpen: boolean = false;
    public parentSearchOpen: boolean = false;
    public parentSearchTerm: string = '';

    public recentItems: any[] = [];

    public parentTypes: string[] = [];

    constructor(
        public model: model,
        public view: view,
        public broadcast: broadcast,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public modal: modal
    ) {
        super(model, view, language, metadata, router);

        // subscriber to the broadcast when new model is added from the model
        this.subscriptions.add(
            this.broadcast.message$.subscribe({next: (message) => this.handleMessage(message)})
        );

        this.subscriptions.add(
            this.model.data$.subscribe({
                next: () => {
                    this.getFieldSet();
                }
            })
        );
    }

    get parentIdField() {
        return this.fieldconfig.parentIdField ? this.fieldconfig.parentIdField : 'parent_id';
    }

    get parentTypeField() {
        return this.fieldconfig.parentTypeField ? this.fieldconfig.parentTypeField : 'parent_type';
    }

    /**
     * get the parent name
     */
    get parentName() {
        return this.model.getField(this.fielddefs.rname ?? 'summary_text');
    }

    /**
     * get the parent type
     */
    get parentType() {
        return this.model.getField(this.parentTypeField);
    }

    /**
     * gets the parent id
     */
    get parentId() {
        return this.model.getField(this.parentIdField);
    }

    /**
     * a getter for thec config setting to display the module icon or hide it
     */
    get displayModuleIcon() {
        return !this.fieldconfig.hidemoduleicon;
    }

    /**
     * a getter for the value bound top the model
     * this is a fallback used when no fieldset is defined
     */
    get value() {
        // get related data
        let reldata = this.model.getField(this.fieldname);

        // if no reladat return empty
        if(!reldata) return '';

        // if rname is set use that value otherwise the summary text
        return this.fielddefs?.rname ? reldata[this.fielddefs?.rname] : reldata.summary_text;
    }

    /**
     * a setter that returns the value to the model and triggers the validation
     *
     * @param val the new value
     */
    set value(val) {
        return;
    }

    get relData() {
        return this.model.getField(this.fieldname) ?? {};
    }

    public ngOnInit() {
        // determine the valid types
        this.determineParentTypes();
        // initialize the parenttype
        if (!this.model.getField(this.parentTypeField) || this.model.getField(this.parentTypeField) == '') {
            this.model.setField(this.parentTypeField, this.parentTypes[0]);
        }

    }

    /**
     * determines the fieldset
     * @private
     */
    private getFieldSet(){
        this.fieldconfig.fieldset = undefined;
        let c = this.metadata.getComponentConfig('fieldLinkedParent', this.parentType);
        if (c.fieldset) {
            this.fieldconfig.fieldset = c.fieldset;
        } else {
            c = this.metadata.getComponentConfig('fieldLinked', this.parentType);
            if (c.fieldset) this.fieldconfig.fieldset = c.fieldset;
        }
    }

    /**
     * get the valid parent types from the metadata or the field config
     */
    public determineParentTypes() {
        let parenttypes = [];
        if (this.fieldconfig.parenttypes) {
            parenttypes = this.fieldconfig.parenttypes.replace(/\s/g, '').split(',');
        } else if (this.field_defs.parent_modules) {
            parenttypes = this.field_defs.parent_modules;
        }

        if (!this.fieldconfig.sortbyparenttypes){
            parenttypes.sort((a, b) => this.language.getModuleName(a).toLowerCase() > this.language.getModuleName(b).toLowerCase() ? 1 : -1);
        }

        this.parentTypes = parenttypes;
    }

    public handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // clear the searchterm
                        this.parentSearchTerm = '';

                        // set the model
                        let modelFields: any = {};
                        modelFields[this.parentIdField] = message.messagedata.data.id;
                        modelFields[this.fieldname] = message.messagedata.data.summary_text;
                        this.model.setFields(modelFields, true);
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

    public closePopups() {
        if (this.model.getField(this.parentIdField)) {
            this.parentSearchTerm = '';
        }

        this.parentSearchOpen = false;
        this.parentTypeSelectOpen = false;

        this.clickListener();
    }

    public setParent(parent) {
        this.model.setField(this.fieldname, parent.data);
        this.model.setField(this.parentIdField, parent.id);
    }

    public toggleParentTypeSelect() {
        this.parentTypeSelectOpen = !this.parentTypeSelectOpen;
        this.parentSearchOpen = false;
    }

    public setParentType(parentType) {
        this.parentSearchTerm = '';

        this.model.setField(this.parentTypeField, parentType);
        this.parentTypeSelectOpen = false;

    }

    public clearParent() {
        if (this.fieldconfig.promptondelete) {
            this.modal.confirm(
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)], 'long'),
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)])
            ).subscribe(response => {
                if (response) {
                    this.removeRelated();
                }
            });
        } else {
            this.removeRelated();
        }
    }

    public removeRelated() {
        this.model.setField(this.fieldname, '');
        this.model.setField(this.parentIdField, '');
    }

    public openParentTypes() {
        this.parentTypeSelectOpen = true;
        this.parentSearchOpen = false;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    public onFocusParent() {
        this.parentTypeSelectOpen = false;
        this.parentSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    public searchWithModal() {
        this.parentSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.parentType;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.setParent({
                        id: items[0].id,
                        text: items[0].summary_text,
                        data: items[0]
                    });
                }
            });
            selectModal.instance.searchTerm = this.parentSearchTerm;
        });
    }

}
