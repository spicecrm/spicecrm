import {Component, Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {language} from "../../services/language.service";

declare var _;

/**
 *
 */
@Component({
    selector: 'system-card',
    templateUrl: './src/systemcomponents/templates/card.html',
})
export class SystemCard
{
    @Input('class') additional_css_classes:string;
    @Input() header_icon:string;
    @Input() actionset_id:string;
    @Input() collapsible = true;
    @Input() collapsed = false;
    @Output('collapsedChange') collapsed$ = new EventEmitter();

    constructor(
        private language: language
    ){

    }

    toggleCollapsed()
    {
        console.log(this.collapsible);
        if(!this.collapsible) return false;

        this.collapsed = !this.collapsed;
        this.collapsed$.emit(this.collapsed);
    }

}

@Directive({
    selector: 'system-card-header-title'
})
export class SystemCardHeaderTitle{}

@Directive({
    selector: 'system-card-body'
})
export class SystemCardBody{}

@Directive({
    selector: 'system-card-footer',
    //template: `<footer class="slds-card__footer"><ng-content></ng-content></footer>`,
})
export class SystemCardFooter{}