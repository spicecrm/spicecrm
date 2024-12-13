/**
 * @module ModuleSpiceImports
 */
import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';

import {modellist} from "../../../services/modellist.service";
import {model} from "../../../services/model.service";

@Component({
    selector: 'spice-imports-view-item',
    templateUrl: '../templates/spiceimportsviewitem.html',
    providers: [model]
})
export class SpiceImportsViewItem implements OnInit{

    @Input() public item = undefined;

    constructor(public language: language, public modellist: modellist, public model: model) {
    }

    public ngOnInit() {
        this.model.module = 'SpiceImports';
        this.model.id = this.item.id;
        this.model.initialize();
        this.model.setData(this.item);
    }

    public selectItem(){
        let si = this.modellist.listData.list.find(i => i.selected);
        if(si) si.selected = false;
        this.item.selected = true;
        this.modellist.selectionChanged$.emit(this.item.id);
    }
}
