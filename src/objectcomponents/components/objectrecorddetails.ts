import {AfterViewInit, OnInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-details',
    templateUrl: './app/objectcomponents/templates/objectrecorddetails.html',
    providers: [view]
})
export class ObjectRecordDetails implements OnInit, AfterViewInit {
    @ViewChild('detailcontainer', {read: ViewContainerRef}) detailcontainer: ViewContainerRef;

    initialized: boolean = false;
    componentSet: string = '';
    componentconfig: any = {};
    componentRefs: any = [];

    constructor(private view: view, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model, private language: language) {
        this.view.isEditable = true;
    }

    ngOnInit(){
        // check if readonly
        if(this.componentconfig.readonly){
            this.view.isEditable = false;
        }
    }

    ngAfterViewInit() {
        this.initialized = true;

        this.buildContainer();
    }

    buildContainer() {
        for (let component of this.componentRefs) {
            component.destroy();
        }

        // if we do not have a coimponentset from external check the default config

        if (!this.componentconfig.componentset) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
            this.componentSet = componentconfig.componentset;
        } else {
            this.componentSet = this.componentconfig.componentset;
        }


        for (let panel of this.metadata.getComponentSetObjects(this.componentSet)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }

    getBoxStyle() {
        if (this.view.isEditMode()) {
            return {
                'box-shadow': '0 2px 4px 4px rgba(0,0,0,.16)',
                'border-radius': '.25rem'
            }
        } else if(this.componentconfig.displayborder) {
            return {
                'border' : '1px solid #dddbda',
                'border-radius': '.25rem'
            }
        }
    }

    get showHeader(){
        return this.componentconfig['header'] ? true : false;
    }

    get header(){
        return this.language.getLabel(this.componentconfig['header'], this.model.module);
    }
}