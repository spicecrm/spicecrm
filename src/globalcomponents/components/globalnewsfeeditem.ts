/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

declare var moment: any;

@Component({
    selector: 'global-newsfeed-item',
    templateUrl: './src/globalcomponents/templates/globalnewsfeeditem.html',

})
export class GlobalNewsFeedItem {

    @Input() item: any = {}

    constructor(private http: HttpClient) {

    }

    getDate() {
        return moment(this.item.date).fromNow()
    }

    getExcerpt() {
        return this.item.excerpt.rendered.replace('<a', '<a target="_blank"');
    }

}