/**
 * @module GlobalComponents
 */
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {dockedComposer} from '../../services/dockedcomposer.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';
import {telephony} from "../../services/telephony.service";

@Component({
    selector: 'global-docked-composer-modal',
    templateUrl: '../templates/globaldockedcomposermodal.html'
})
export class GlobalDockedComposerModal implements OnInit {

    /**
     * reference to the modal itself to close it
     *
     * @private
     */
   public self: any = {};


    /**
     * the componentconfig
     *
     * @private
     */
   public componentconfig: any;

    constructor(public metadata: metadata,public dockedComposer: dockedComposer,public language: language, public modal: modal, public model: model,public view: view, public telephony:telephony) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // get the config
        this.loadConfig();
    }

    /**
     * loads the config
     *
     * @private
     */
   public loadConfig(){
        this.componentconfig = this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module);
    }

    /**
     * returns the display label
     */
    get displayLabel() {
        return this.model.getField('name') ? this.model.getField('name') : this.language.getModuleName(this.model.module, true);
    }

    /**
     * closes the modal and resturns back to the composer view
     * if the composer is not yet created .. create one in the process of minimizing
     * this happens when the composer window is created from another source and needs to be considered
     *
     * @private
     */
   public minimize() {
        // if we do not yet have a composer .. create one
        if(!this.dockedComposer.composers.find(c => c.id == this.model.id) && !this.telephony.calls.find(t => t.id)){
            this.dockedComposer.addComposer(this.model.module, this.model);
        }
        // destroy the modal
        this.self.destroy();
    }

    /**
     * closes the composer and the modal
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
     * closes the composer and the modal window
     * @private
     */
   public closeComposer() {
        for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
            if (this.dockedComposer.composers[i].id === this.model.id) {
                this.dockedComposer.composers.splice(i, 1);
            }
        }
        this.self.destroy();
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
}
