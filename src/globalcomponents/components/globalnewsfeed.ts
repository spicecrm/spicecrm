/**
 * Created by christian on 08.11.2016.
 */
import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Component({
    selector: 'global-newsfeed',
    templateUrl: './app/globalcomponents/templates/globalnewsfeed.html',

})
export class GlobalNewsFeed{

    news: Array<any> = [];
    isLoading: boolean = true;

    constructor(private http: HttpClient) {
        /*
        this.http.get('http://www.spicecrm.io/wp-json/wp/v2/posts')
            .subscribe(res => {
                this.news = res.json();
                this.isLoading = false;
            });
            */
        this.http.get('proxy/?useurl=' + btoa('http://www.spicecrm.io/wp-json/wp/v2/posts'))
            .subscribe((res : any) => {
                this.news = res;
                this.isLoading = false;
            });
    }

    getContainerClass(){
        if(this.isLoading)
            return 'slds-align--absolute-center';
        else
            return '';
    }
}