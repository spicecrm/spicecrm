import {
    AfterViewInit,
    OnInit,
    ComponentFactoryResolver,
    Component,
    ViewChild,
    ViewContainerRef,
    Renderer2, OnDestroy
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-details',
    templateUrl: './src/objectcomponents/templates/objectrecorddetails.html',
    providers: [view]
})
export class ObjectRecordDetails implements OnInit {

    private componentSet = '';
    private componentconfig: any = {};

    constructor( private view: view, private metadata: metadata, private componentFactoryResolver: ComponentFactoryResolver, private model: model, private language: language, private renderer: Renderer2 ) {
        this.view.isEditable = true;
    }

    public ngOnInit() {
        // check if readonly
        if (this.componentconfig.readonly) {
            this.view.isEditable = false;
        }
        this.buildContainer();
    }

    private buildContainer() {
        // if we do not have a coimponentset from external check the default config
        if (!this.componentconfig.componentset) {
            let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
            this.componentSet = componentconfig.componentset;
        } else {
            this.componentSet = this.componentconfig.componentset;
        }
    }

    private cancel() {
        this.model.cancelEdit();
        this.view.setViewMode();
    }

    private save() {
        if (this.model.validate()) {
            this.model.save(true);
            this.view.setViewMode();
        }
    }

    private getBoxStyle() {
        if (this.view.isEditMode()) {
            return {
                'box-shadow': '0 2px 4px 4px rgba(0,0,0,.16)',
                'border-radius': '.25rem'
            };
        } else if (this.componentconfig.displayborder) {
            return {
                'border': '1px solid #dddbda',
                'border-radius': '.25rem'
            };
        }
    }

    get showHeader() {
        return this.componentconfig.header ? true : false;
    }

    get header() {
        return this.language.getLabel(this.componentconfig.header, this.model.module);
    }

}
