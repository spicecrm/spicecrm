/**
 * @module GlobalComponents
 */
import {ElementRef, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {layout} from '../../services/layout.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {model} from '../../services/model.service';

@Component({
    selector: '[global-search-module-item]',
    templateUrl: './src/globalcomponents/templates/globalsearchmoduleitem.html',
    providers: [view, model]
})
export class GlobalSearchModuleItem implements OnInit {
    @Input() private module: string = '';
    @Input() private listfields: string = '';
    @Input() private listitem: any = {};

    private expanded: boolean = false;

    constructor(private elementref: ElementRef, private router: Router, private view: view, private model: model, private language: language, private layout: layout) {
        this.view.isEditable = false;
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        this.model.module = this.listitem._source._module;
        this.model.id = this.listitem._id;
        this.model.data = this.model.utils.backendModel2spice(this.model.module, this.listitem._source);
        this.model.data.acl = this.listitem.acl;
        this.model.data.acl_fieldcontrol = this.listitem.acl_fieldcontrol;

        // add acl so the links work as well
        this.model.data.acl = this.listitem.acl;
    }

    private navigateDetail(event) {
        // stop the click here
        event.stopPropagation();

        // see if we can navigate
        if (this.model.data.acl.detail) {
            this.model.goDetail();
        }
    }

    private toggleexpanded() {
        this.expanded = !this.expanded;
    }

    get isexpanded() {
        return this.layout.screenwidth != 'small' || this.expanded;
    }

    get expandicon() {
        return this.expanded ? 'chevronup' : 'chevrondown';
    }
}
