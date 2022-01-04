/**
 * @module ModuleHome
 */
import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';

@Component({
    selector: 'home-assistant-tile',
    templateUrl: '../templates/homeassistanttile.html',
    providers: [model, view]
})
export class HomeAssistantTile implements OnInit {
    @Input() item: any = {};

    tileFields: Array<any> = [];
    actionset: string = '';

    constructor(public language: language, public model: model, public view: view, public metadata: metadata) {
        view.isEditable = false;
    }

    ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('HomeAssistantTile', this.item.module);

        if (componentconfig && componentconfig.fieldset)
            this.tileFields = this.metadata.getFieldSetFields(componentconfig.fieldset);

        if (componentconfig && componentconfig.actionset)
            this.actionset = componentconfig.actionset;

        this.model.module = this.item.module;
        this.model.id = this.item.id;
        this.model.setData(this.item.data);
    }

    goDetail() {
        this.model.goDetail();
    }
}
