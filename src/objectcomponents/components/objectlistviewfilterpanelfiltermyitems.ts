/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, NgModule, ViewChild, ViewContainerRef,
    ElementRef
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router, ActivatedRoute}   from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {listfilters} from '../services/listfilters.service';

@Component({
    selector: 'object-listview-filter-panel-filter-myitems',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfiltermyitems.html',
    host: {
        '(click)': 'this.onClick()',
        '(document:click)': 'this.onDocumentClick($event)'
    }
})
export class ObjectListViewFilterPanelFilterMyItems {
    @ViewChild('popover', {read: ViewContainerRef}) popover: ViewContainerRef;
    showPopover: boolean = false;
    filterValue: string = 'all';

    constructor(private listfilters: listfilters, private elementRef: ElementRef, private metadata: metadata, private language: language, private componentFactoryResolver: ComponentFactoryResolver, private modellist: modellist) {

    }

    onClick() {
        if (!this.showPopover) {
            this.showPopover = true;
            return;
        }
    }

    onFocus(event){
        window.setTimeout(function(){event.target.blur();}, 250);
    }

    closePopover(){
        this.showPopover = false;
    }

    onDocumentClick(event: MouseEvent): void {
        if (this.showPopover) {
            const clickedInside = this.elementRef.nativeElement.contains(event.target);
            if (!clickedInside) {
                this.showPopover = false;
            }
        }
    }

    getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ( (rect.height - poprect.height) / 2 )) + 'px',
            left: (rect.left - poprect.width - 15) + 'px',
            display: (this.showPopover ? '' : 'none')
        }
    }
}