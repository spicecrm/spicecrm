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
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'global-docked-composer-modal',
    templateUrl: './src/globalcomponents/templates/globaldockedcomposermodal.html',
    // providers: [model, view]
})
export class GlobalDockedComposerModal implements OnInit {

    @ViewChild('containercontent', {read: ViewContainerRef}) containercontent: ViewContainerRef;

    self: any = {};

    isClosed: boolean = false;

    constructor(private metadata: metadata, private dockedComposer: dockedComposer, private language: language, public model: model, private view: view) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    setModel(model) {
        this.model.id = model.id;
        this.model.module = model.module;
        this.model.data = model.data;
    }

    ngOnInit() {
        // get the config
        let componentconfig = this.metadata.getComponentConfig('GlobalDockedComposerModal', this.model.module);

        if (!componentconfig.fieldset && !componentconfig.componentset)
            componentconfig = this.metadata.getComponentConfig('GlobalDockedComposer', this.model.module);

        if (componentconfig.componentset) {
            let components = this.metadata.getComponentSetObjects(componentconfig.componentset);
            for(let component of components){
                this.metadata.addComponent(component.component, this.containercontent).subscribe(componentRef => {
                    componentRef.instance['componentconfig'] = component.componentconfig;
                })
            }
        } else if (componentconfig.fieldset) {
            this.metadata.addComponent('ObjectRecordFieldset', this.containercontent).subscribe(componentRef => {
                componentRef.instance.direction = 'vertical';
                componentRef.instance.fieldset = componentconfig.fieldset;
            })
        }
    }

    get displayLabel(){
        return this.model.data.name ? this.model.data.name : this.language.getModuleName(this.model.module, true);;
    }

    minimize() {
        this.self.destroy();
    }

    closeComposer() {
        for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
            if (this.dockedComposer.composers[i]['id'] === this.model.id)
                this.dockedComposer.composers.splice(i, 1);
        }
        this.self.destroy();
    }

    saveComposer() {
        this.model.save().subscribe(result => {
            for (let i: number = 0; i < this.dockedComposer.composers.length; i++) {
                if (this.dockedComposer.composers[i]['id'] === this.model.id)
                    this.dockedComposer.composers.splice(i, 1);
            }
            this.self.destroy();
        });

    }
}