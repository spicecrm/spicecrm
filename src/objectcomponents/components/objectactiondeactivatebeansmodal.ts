/**
 * @module ObjectComponents
 */
import {
    Component, Input, OnInit,
} from '@angular/core';

import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {NgModel} from "@angular/forms";


/**
 * renders a modal window to show all selected beans to select the active one
 */
@Component({
    templateUrl: '../templates/objectactiondeactivatebeansmodal.html',
    providers: [model]
})
export class ObjectActionDeactivateBeansModal implements OnInit {

    /**
     * the componentconfig that gets passed in when the modal is created
     */
    public componentconfig: any = {};


    /**
     * all selected beans
     */
    @Input() public selectedItems: any = [];

    /**
     * all selected beans
     */
    @Input() public module: any = [];

    /**
     * a reference to the modal itself so the modal can close itself
     */

    /**
     * show finish button to close modal
     */
    public showfinish: boolean = false;


    public self: any = {};
    public value: string = "";



    constructor(
        public language: language,
        public model: model,
        public metadata: metadata
    ) {}


    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig('ObjectActionDeactivateBeansModal', this.model.module);
        this.value = this.selectedItems[0].id;
    }

    public fieldname(item) {
        return item[this.componentconfig.fieldname];
    }

    /**
     * destroy the component
     */
    public closeModal() {
        this.self.destroy();
    }

    /**
     * Set the successor_id and the is_inactive-flag of the inactive beans
     */
    public select() {
        let itemcounter = 0;
        let save = 0;
        for (let item of this.selectedItems) {
            if (item.id != this.value) {
                item.successor_id = this.value;
                item.is_inactive = 1;

                this.model.reset();
                this.model.id = item.id;
                this.model.initialize();
                this.model.module = this.module;
                this.model.setData(item);


                if (this.model.validate()) {

                    this.model.save().subscribe(
                    success => {
                            itemcounter++;
                            item.itemsaved = "deactivated";
                            if(itemcounter == this.selectedItems.length - 1) {
                                this.showfinish = true;
                            }
                        },
                    error => {
                            itemcounter++;
                            item.itemsaved = "error";
                            if(itemcounter == this.selectedItems.length - 1) {
                                this.showfinish = true;
                        }
                    });
                } else {
                    itemcounter++;
                }
            } else {
                itemcounter++;
            }
        }
    }
}
