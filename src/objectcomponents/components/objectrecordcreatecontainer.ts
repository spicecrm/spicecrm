/**
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit, Optional,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {Subject, Observable} from 'rxjs';

import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modalwindow} from "../../services/modalwindow.service";
import {navigationtab} from "../../services/navigationtab.service";

/**
 * renders a modal window to add or edit an object record
 */
@Component({
    selector: 'object-record-create-container',
    templateUrl: '../templates/objectrecordcreatecontainer.html',
    providers: [model, view]
})
export class ObjectRecordCreateContainer implements OnInit {
    /**
     * the componentconfig that gets passed in when the modal is created
     */
    public componentconfig: any;

    /**
     * local copy of the dfuplicates from the model
     */
    public duplicates: any[] = [];

    /**
     * indicates if the user has chosen to display duplicates.
     */
    public showDuplicates: boolean = false;

    /**
     * set if the known duplicates table should be shown
     */
    public showDuplicatesTable: boolean = false;

    @Input() public preventGoingToRecord = false;

    constructor(
        public router: Router,
        public language: language,
        public model: model,
        public view: view,
        public metadata: metadata,
        public modal: modal,
        @Optional() public navigationtab: navigationtab,
    ) {
        // view is editable
        this.view.isEditable = true;

        // do not follow links
        this.view.displayLinks = false;

        // set the edit mode
        this.view.setEditMode();

        // start editing
        this.model.startEdit();

    }

    public ngOnInit() {

        // get the tab info:
        let params = this.navigationtab.activeRoute.params;
        this.model.module = params.module;
        this.model.id = params.id;
        this.model.initialize();

        // set the data we giot passed in
        if(this.navigationtab.tabdata?.data) {
            this.model.setData(this.navigationtab.tabdata.data);
        }

        if(!this.componentconfig) {
            this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.model.module);
        }

       this.metadata.getActionSetItems(this.componentconfig.actionset);

        this.setHeader();
    }


    /**
     * a getter for the modal header which text shoudl be displayed
     */
    public setHeader() {
        this.navigationtab.setTabInfo({
            displaymodule: this.model.module,
            displayname: this.model.module != '' ? this.language.getModuleName(this.model.module, true) : '',
            displayicon: 'new'
        })
    }

    /**
     * returns if the duplicate check iss enabled for the module. Used for the visiblity of he duplicates button in the view
     */
    get duplicateCheckEnabled() {
        return this.model.isNew && this.metadata.getModuleDuplicatecheck(this.model.module);
    }

    /**
     * handles the emitted action
     *
     * @param action
     */
    public handleAction(action){
        console.log(action);
        switch(action){
            case 'cancel':
                this.navigationtab.closeTab();
                break;
            case 'save':
                this.navigationtab.closeTab();
                this.model.goDetail(this.navigationtab ? this.navigationtab.objecttab.parentid : null);
                break;
        }
    }

}
