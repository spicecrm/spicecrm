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

@Component({
    selector: 'global-docked-composer',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposer.html',
    providers: [model, view]
})
export class GlobalDockedComposer implements OnInit {

    @ViewChild('containercontent', {read: ViewContainerRef, static: true}) private containercontent: ViewContainerRef;

    @Input() public composerdata: any = {};
    @Input() public composerindex: number;

    private isClosed: boolean = false;

    constructor(private metadata: metadata, private dockedComposer: dockedComposer, private language: language, private model: model, private view: view, private modal: modal, private ViewContainerRef: ViewContainerRef) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // initialize the model
        this.model.module = this.composerdata.module;
        this.model.id = this.composerdata.id;

        if (this.composerdata.model.data) {
            this.model.data = this.composerdata.model.data
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
    }

    get displayLabel() {
        return this.model.data.name ? this.model.data.name : this.language.getModuleName(this.model.module, true);
    }

    private toggleClosed() {
        this.isClosed = !this.isClosed;
    }

    get toggleIcon() {
        return this.isClosed ? 'erect_window' : 'minimize_window';
    }

    private expand() {
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);

    }

    private closeComposer() {
        for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
            if (this.dockedComposer.composers[i].id === this.composerdata.id) {
                this.dockedComposer.composers.splice(i, 1);
            }
        }
    }

    private saveComposer(goto = false) {
        this.model.save().subscribe((result) => {
            // navigate to the record
            if (goto) this.model.goDetail();

            // remove the composer
            for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
                if (this.dockedComposer.composers[i].id === this.composerdata.id) {
                    this.dockedComposer.composers.splice(i, 1);
                }
            }
        });
    }
}