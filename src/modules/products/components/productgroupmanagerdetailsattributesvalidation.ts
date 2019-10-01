/**
 * @module ModuleProducts
 */
import {Component, HostBinding, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'product-group-manager-details-attributes-validation',
    templateUrl: './src/modules/products/templates/productgroupmanagerdetailsattributesvalidation.html',
    providers: [model]
})
export class ProductGroupManagerDetailsAttributesValidation implements OnInit, OnDestroy {
    @ViewChild('buttoncontainer', {read: ViewContainerRef, static: true}) private buttonContainer: ViewContainerRef;
    @Input() private parent: any = {};
    public listFields: any[] = [];

    constructor(private language: language,
                private backend: backend,
                private model: model,
                private metadata: metadata,
                private relatedmodels: relatedmodels) {
        this.model.module = 'ProductAttributeValueValidations';
    }

    get canEdit() {
        return this.metadata.checkModuleAcl(this.model.module, "create");
    }

    get tableContainerStyle() {
        return {
            'max-height': `calc(100% - ${this.buttonContainer.element.nativeElement.getBoundingClientRect().height}px`,
            'min-height': '10px'
        };
    }

    public ngOnInit() {
        let compConfig = this.metadata.getComponentConfig('ProductGroupManagerDetailsAttributesValidation', 'ProductGroups');
        this.listFields = compConfig && compConfig.fieldset ? this.metadata.getFieldSetFields(compConfig.fieldset) : [];
    }

    public addItem() {
        this.model.id = '';
        this.model.addModel('', this.parent).subscribe(item => {
            if (typeof item === "object") {
                this.relatedmodels.items = [...this.relatedmodels.items,item];
            }
        });
    }

    private trackByFn(index, item) {
        return item.id;
    }

    public ngOnDestroy() {
        this.relatedmodels.stopSubscriptions();
    }
}
