/**
 * @module ObjectFields
 */
import {Component, ElementRef, OnInit} from '@angular/core';
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

@Component({
    selector: 'field-relate',
    templateUrl: './src/objectfields/templates/fieldrelate.html',
    providers: [popup]
})
export class fieldRelate extends fieldGeneric implements OnInit {
    private relateIdField: string = '';
    private relateNameField: string = '';
    private relateType: string = '';
    private relateSearchOpen: boolean = false;
    private relateSearchTerm: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public modal: modal,
        public backend: backend,
        public toast: toast
    ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
    }

    /**
     * returns if an icon shoudl be displayed
     */
    get displayicon(){
        return this.fieldconfig.displayicon ? true : false;
    }

    /**
     * retuns if add is disabled for the relate dorpdown
     */
    get disableadd() {
        return this.fieldconfig.disableadd;
    }

    /**
     * closes all dropdowns that might be oipen and clears the searchterm
     */
    private closePopups() {
        if (this.model.getField(this.relateIdField)) {
            this.relateSearchTerm = '';
        }
        this.relateSearchOpen = false;
    }


    /**
     * resets the field on the  model
     */
    private clearField() {
        this.model.setField(this.relateNameField, '') ;
        this.model.setField(this.relateIdField, '');
    }

    /**
     * open the recent items when the feld recievs the focus
     */
    private onFocus() {
        this.relateSearchOpen = true;
    }

    /**
     * set the related item
     *
     * @param related the related record
     */
    private setRelated(related) {
        this.model.setField(this.relateIdField, related.id);
        this.model.setField(this.relateNameField, related.text) ;
        if (this.fieldconfig.executeCopyRules == 2) {
            this.executeCopyRules(related.id);
        } else if (this.fieldconfig.executeCopyRules == 1) {
            this.modal.confirm('Copy the data from related record?', 'Copy data?').subscribe(answer => answer && this.executeCopyRules(related.id));
        }
        this.closePopups();
    }

    /**
     * if config is set the copy rules are evaluated and data from the related record is copied to the current one
     *
     * @param idRelated the related id
     */
    private executeCopyRules(idRelated) {
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
    private goRelated() {
        // go to the record
        this.router.navigate(['/module/' + this.relateType + '/' + this.model.getField(this.relateIdField)]);
    }

    /**
     * opens a search modal
     */
    private searchWithModal() {
        this.relateSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.relateType;
            selectModal.instance.modulefilter = this.fieldconfig.modulefilter;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.setRelated({id: items[0].id, text: items[0].summary_text, data: items[0]});
                }
            });
            selectModal.instance.searchTerm = this.relateSearchTerm;
        });
    }

}
