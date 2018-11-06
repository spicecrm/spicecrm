/**
 * Created by christian on 08.11.2016.
 */
import {ElementRef, Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { fts } from '../../services/fts.service';
import { language } from '../../services/language.service';
import { view } from '../../services/view.service';
import { model } from '../../services/model.service';

@Component({
    selector: '[global-search-module-item]',
    templateUrl: './src/globalcomponents/templates/globalsearchmoduleitem.html',
    providers:[view, model]
})
export class GlobalSearchModuleItem implements OnInit {
    @Input() private module: string = '';
    @Input() private listfields: string = '';
    @Input() private listitem: any = {};

    constructor(private elementref: ElementRef, private router: Router, private view: view, private model: model){
        this.view.isEditable = false;
    }

    public ngOnInit() {
        this.model.module = this.listitem._type;
        this.model.id = this.listitem._id;
        this.model.data = this.listitem._source;

        // add acl so the links work as well
        this.model.data.acl = this.listitem.acl;
    }

    private navigateDetail() {
        this.model.goDetail();
    }
}
