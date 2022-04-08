/**
 * @module GlobalComponents
 */
import {
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';

declare var _: any;

@Component({
    selector: 'global-docked-composer',
    templateUrl: '../templates/globaldockedcomposer.html',
    providers: [model, view]
})
export class GlobalDockedComposer implements OnInit {

    /**
     * refernce to the container content
     */
    @ViewChild('containercontent', {read: ViewContainerRef, static: true})public containercontent: ViewContainerRef;

    @Input() public composerdata: any = {};
    @Input() public composerindex: number;

    /**
     * if the composer is closed
     *
     * @private
     */
   public isClosed: boolean = false;

    /**
     * the actionset to be rendered in teh composer
     *
     * @private
     */
   public actionset: string;

    constructor(public metadata: metadata,public dockedComposer: dockedComposer,public language: language,public model: model,public view: view,public modal: modal,public ViewContainerRef: ViewContainerRef) {
        // set the view to editable and to editmode
        this.view.isEditable = true;
        this.view.setEditMode();

        // set the model to editing
        this.model.isEditing = true;

        // set to global
        this.model.isGlobal = true;
    }

    public ngOnInit() {
        // initialize the model
        this.model.module = this.composerdata.module;
        this.model.id = this.composerdata.id;

        if (this.composerdata.model.data) {
            this.model.setData(this.composerdata.model.data, false);
        } else {
            this.model.initializeModel();
        }

        this.dockedComposer.composers[this.composerindex].model = this.model;

        // get the config
        let componentconfig = this.metadata.getComponentConfig('GlobalDockedComposer', this.model.module);
        if (componentconfig.componentset) {
            let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
            for (let component of components) {
                this.metadata.addComponent('ObjectRecordFieldset', this.containercontent).subscribe(componentRef => {
                    componentRef.instance.componentconfig = component.componentconfig;
                });
            }
        } else if (componentconfig.fieldset) {
            this.metadata.addComponent('ObjectRecordFieldset', this.containercontent).subscribe(componentRef => {
                componentRef.instance.direction = 'vertical';
                componentRef.instance.fieldset = componentconfig.fieldset;
            });
        }

        // set the actionset
        this.actionset = componentconfig.actionset;

        // check if the composer should be auto expanded on init
        if (this.composerdata.loadexpanded && this.canExpand) {
            this.expand();
            this.composerdata.loadexpanded = false;
        }
    }

    /**
     * getter for a display label
     * Eiter displays the modal name if set or the module name
     */
    get displayLabel() {
        return this.model.getField('name') ? this.model.getField('name') : this.language.getModuleName(this.model.module, true);
    }

    /**
     * toggles the composer to be open or closed
     *
     * @private
     */
   public toggleClosed() {
        this.isClosed = !this.isClosed;
    }

    /**
     * returns the toggle icon to either minimize or maximize the composer based on the close state
     */
    get toggleIcon() {
        return this.isClosed ? 'erect_window' : 'minimize_window';
    }

    /**
     * checks if a GlobalDockedComposermodal is availabe for the module and thus the modal can be opened.
     */
    get canExpand() {
        return !_.isEmpty(this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module));
    }

    /**
     * expands the comoser and opens the GlobalDockedComposerModal window
     *
     * @private
     */
   public expand() {
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
    }

    /**
     * handle the action from the actionset that is returned
     *
     * @param action
     * @private
     */
   public handleaction(action) {
        switch (action) {
            case 'savegodetail':
                this.model.goDetail();
                this.closeComposer();
                break;
            default:
                this.closeComposer();
        }
    }

    /**
     * closes the current composer
     *
     * @private
     */
   public promptClose() {
        this.modal.prompt('confirm', this.language.getLabel('MSG_CANCEL', '', 'long'), this.language.getLabel('MSG_CANCEL')).subscribe(answer => {
            if (answer) {
                this.closeComposer();
            }
        });

    }

    /**
     * closes the composer
     *
     * @private
     */
   public closeComposer() {
        for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
            if (this.dockedComposer.composers[i].id === this.composerdata.id) {
                this.dockedComposer.composers.splice(i, 1);
            }
        }
    }
}
