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

@Component({
    selector: 'global-docked-composer-modal',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposermodal.html'
})
export class GlobalDockedComposerModal implements OnInit {

    /**
     * reference to the modal itself to close it
     *
     * @private
     */
    private self: any = {};


    /**
     * the componentconfig
     *
     * @private
     */
    private componentconfig: any;

    constructor(private metadata: metadata, private dockedComposer: dockedComposer, private language: language, public modal: modal, public model: model, private view: view) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // get the config
        this.componentconfig = this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module);

        /*
        if (!componentconfig.fieldset && !componentconfig.componentset) {
            componentconfig = this.metadata.getComponentConfig('GlobalDockedComposer', this.model.module);
        }

        if (componentconfig.componentset) {
            let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.containercontent).subscribe(componentRef => {
                    componentRef.instance.componentconfig = component.componentconfig;
                });
            }
        } else if (componentconfig.fieldset) {
            this.metadata.addComponent('ObjectRecordFieldset', this.containercontent).subscribe(componentRef => {
                componentRef.instance.direction = 'vertical';
                componentRef.instance.fieldset = componentconfig.fieldset;
            });
        }
        */
    }

    get displayLabel() {
        return this.model.data.name ? this.model.data.name : this.language.getModuleName(this.model.module, true);
    }

    /**
     * closes the modal and resturns back to the composer view
     *
     * @private
     */
    private minimize() {
        this.self.destroy();
    }

    /**
     * closes the composer and the modal
     *
     * @private
     */
    private promptClose() {
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
    private closeComposer() {
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
    private handleaction(action) {
        switch (action) {
            case 'savegodetail':
                this.model.goDetail();
                this.closeComposer();
                break;
            default:
                this.closeComposer();
        }
    }

    private saveComposer(goto = false) {
        if (this.model.validate()) {
            this.model.save().subscribe(result => {
                // navigate to the record
                if (goto) this.model.goDetail();

                // remove the docked composer
                for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
                    if (this.dockedComposer.composers[i].id === this.model.id) {
                        this.dockedComposer.composers.splice(i, 1);
                    }
                }

                // destroy the modal
                this.self.destroy();
            });
        }
    }
}
