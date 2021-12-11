/**
 * @module ObjectFields
 */
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {modal} from '../../services/modal.service';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {relateFilter} from "../../services/interfaces.service";

@Component({
    selector: 'field-relate',
    templateUrl: '../templates/fieldrelate.html',
    providers: [popup]
})
export class fieldRelate extends fieldGeneric implements OnInit, OnDestroy {
    public relateIdField: string = '';
    public relateNameField: string = '';
    public relateType: string = '';
    public relateSearchOpen: boolean = false;
    public relateSearchTerm: string = '';
    public isAuthorized: boolean = true;

    /**
     * a relateFilter
     */
    public relateFilter: relateFilter;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public modal: modal,
        public backend: backend,
        public toast: toast,
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * returns if an icon shoudl be displayed
     */
    get displayicon() {
        return this.fieldconfig.displayicon ? true : false;
    }

    /**
     * retuns if add is disabled for the relate dorpdown
     */
    get disableadd() {
        return this.fieldconfig.disableadd;
    }

    /**
     * returns the currently set id;
     */
    get id() {
        return this.model.getField(this.relateIdField);
    }

    public ngOnInit() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
        this.isAuthorized = this.metadata.checkModuleAcl(fieldDefs.module, 'list') || this.metadata.checkModuleAcl(fieldDefs.module, 'listrelated');
        this.handleRelateFIlterField();

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
            this.relateFilter = {
                module: fieldDefs.module,
                relationship: this.fieldconfig.relatefilterrelationship,
                id: this.model.getField(fieldDefs.id_name),
                display: this.model.getField(this.fieldconfig.relatefilterfield),
                active: this.model.getField(fieldDefs.id_name) ? true : false,
                required: !!this.fieldconfig.relatedfilterrequired
            };
        }
    }

    /**
     * getter for the placeholder
     */
    get placeholder() {
        // check if we have a relate field and it is required
        if (this.relateFilter && this.fieldconfig.relatedfilterrequired) {
            let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldconfig.relatefilterfield);
            if (!this.model.getField(fieldDefs.id_name)) {
                return this.language.getLabelFormatted('LBL_SELECT_FIELD_FIRST', [this.language.getFieldDisplayName(this.model.module, this.fieldconfig.relatefilterfield)]);
            }
        }

        // return default placeholder
        return this.language.getModuleCombinedLabel('LBL_SEARCH', this.relateType);
    }

    /**
     * returns if the relate filter is required
     */
    get relatedfilterrequired() {
        return this.fieldconfig.relatedfilterrequired;
    }

    /**
     * returns true to set the input to required when a relate filter is set
     */
    get disabled() {
        if (this.relateFilter && this.relatedfilterrequired) {
            let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldconfig.relatefilterfield);
            if (!this.model.getField(fieldDefs.id_name)) return true;
        }

        return false;
    }

    /**
     * updates the relate filter
     */
    public updateRelateFilter() {
        let fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldconfig.relatefilterfield);
        this.relateFilter.id = this.model.getField(fieldDefs.id_name);
        this.relateFilter.display = this.model.getField(this.fieldconfig.relatefilterfield);

        // if this is required and id not set reset the field
        if (this.fieldconfig.relatedfilterrequired && !this.relateFilter.id && this.id) {
            this.removeRelated();
        }

        // toggle the active flag
        this.relateFilter.active = !!this.relateFilter.id ? true : false;
    }

    /**
     * closes all dropdowns that might be oipen and clears the searchterm
     */
    public closePopups() {
        if (this.model.getField(this.relateIdField)) {
            this.relateSearchTerm = '';
        }
        this.relateSearchOpen = false;
    }

    /**
     * resets the field on the  model
     */
    public clearField() {
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

    /**
     * removes the related field
     */
    public removeRelated() {
        let fields = {};
        fields[this.relateNameField] = '';
        fields[this.relateIdField] = '';
        this.model.setFields(fields);
    }

    /**
     * open the recent items when the feld recievs the focus
     */
    public onFocus() {
        this.relateSearchOpen = true;
    }

    /**
     * set the related item
     *
     * @param related the related record
     */
    public setRelated(related) {
        let newFields = {};
        newFields[this.relateIdField] = related.id;
        newFields[this.relateNameField] = related.text;
        this.model.setFields(newFields);
        if (this.fieldconfig.executeCopyRules == 2) {
            this.executeCopyRules(related.id);
        } else if (this.fieldconfig.executeCopyRules == 1) {
            this.modal.confirm(this.language.getLabel('MSG_COPY_DATA', '', 'long'), this.language.getLabel('MSG_COPY_DATA')).subscribe(answer => answer && this.executeCopyRules(related.id));
        }
        this.closePopups();
    }

    /**
     * if config is set the copy rules are evaluated and data from the related record is copied to the current one
     *
     * @param idRelated the related id
     */
    public executeCopyRules(idRelated) {
        let awaitStopper = this.modal.await('LBL_LOADING');
        this.backend.get(this.relateType, idRelated).subscribe(
            (response: any) => {
                let relateModel = {
                    module: this.relateType,
                    id: response.id,
                    data: response
                };
                this.model.executeCopyRulesParent(relateModel);
                awaitStopper.emit();
            },
            () => {
                this.toast.sendToast('ERR_LOADING_RECORD', 'error');
                awaitStopper.emit();
            });
    }

    /**
     * navigates to the related record
     */
    public goRelated() {
        // go to the record
        this.router.navigate(['/module/' + this.relateType + '/' + this.model.getField(this.relateIdField)]);
    }

    /**
     * opens a search modal
     */
    public searchWithModal() {
        this.relateSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.relateType;
            selectModal.instance.modulefilter = this.fieldconfig.modulefilter;
            selectModal.instance.multiselect = false;
            selectModal.instance.relatefilter = this.relateFilter;
            this.subscriptions.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.setRelated({id: items[0].id, text: items[0].summary_text, data: items[0]});
                    }
                })
            );
            selectModal.instance.searchTerm = this.relateSearchTerm;
        });
    }
}
