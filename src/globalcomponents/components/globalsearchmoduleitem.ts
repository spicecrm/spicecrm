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
    templateUrl: '../templates/globalsearchmoduleitem.html',
    providers: [view, model]
})
export class GlobalSearchModuleItem implements OnInit {
    @Input()public module: string = '';
    @Input()public listfields: string = '';
    @Input()public listitem: any = {};

   public expanded: boolean = false;

    constructor(public elementref: ElementRef,public router: Router,public view: view,public model: model,public language: language,public layout: layout) {
        this.view.isEditable = false;
        this.view.displayLabels = false;
    }

    public ngOnInit() {
        // backwards compatibility with elasic 6 and still supporting elastic 7
        this.model.module = this.listitem._type == '_doc' ?  this.listitem._source._module : this.listitem._type;

        this.model.id = this.listitem._id;
        this.model.setData(this.listitem._source);
        this.model.acl = this.listitem.acl;
        this.model.acl_fieldcontrol = this.listitem.acl_fieldcontrol;
    }

   public navigateDetail(event) {
        // stop the click here
        event.stopPropagation();

        // see if we can navigate
        if (this.model.checkAccess('detail')) {
            this.model.goDetail();
        }
    }

   public toggleexpanded() {
        this.expanded = !this.expanded;
    }

    get isexpanded() {
        return this.layout.screenwidth != 'small' || this.expanded;
    }

    get expandicon() {
        return this.expanded ? 'chevronup' : 'chevrondown';
    }
}
