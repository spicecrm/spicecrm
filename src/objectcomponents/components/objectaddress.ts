/**
 * @module ObjectComponents
 */
import { Component, Input, OnInit } from '@angular/core';
import { metadata } from '../../services/metadata.service';
import { model } from '../../services/model.service';
import { view } from '../../services/view.service';
import { footer } from '../../services/footer.service';
import { modelutilities } from '../../services/modelutilities.service';
import { language } from '../../services/language.service';

@Component({
    selector: 'object-address',
    templateUrl: '../templates/objectaddress.html',
    providers: [model]
})
export class ObjectAddress implements OnInit{

    componentconfig: any = {};
    @Input() address: any = {};
    @Input() parent: any = {};
    @Input() fieldset: string = '';

    constructor( public language: language, public metadata: metadata, public model: model, public view: view, public modelutilities: modelutilities, public footer: footer) {
        this.model.module = 'Addresses';
    }

    ngOnInit(){
        this.model.id = this.address.id;
        this.model.setData(this.address);

        // see if we have a fieldset
        if(this.fieldset == undefined || this.fieldset == ''){
            let config = this.metadata.getComponentConfig('ObjectAddress', this.parent.module);
            if(config.fieldset != undefined || config.fieldset != '') {
                this.fieldset = config.fieldset;
            }
        }

    }

    deleteAddress(){
        this.metadata.addComponent('SystemConfirmDialog', this.footer.footercontainer).subscribe(componenRef => {
            componenRef.instance.title = this.language.getLabel('LBL_DELETE_ADDRESS_TITLE', 'Addresses');
            componenRef.instance.message = this.language.getLabel('LBL_DELETE_ADDRESS_TEXT', 'Addresses');
            componenRef.instance.answer.subscribe(decision => {
                if (decision) {
                    this.model.setField('deleted', true);
                }
            });
        });
    }

}
