import {
    AfterViewInit, ComponentFactoryResolver, Component, Input, NgModule, ViewChild, ViewContainerRef,
    OnInit
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

@Component({
    selector: 'global-newsfeed',
    templateUrl: './src/globalcomponents/templates/globalnewsfeed.html',
})
export class GlobalNewsFeed{

    private news: Array<any> = [];
    private isLoading: boolean = true;

    constructor(private http: HttpClient) {
        let url = btoa('http://www.spicecrm.io/wp-json/wp/v2/posts');
        this.http.get('proxy/?useurl=' + url)
            .subscribe((res: any) => {
                this.news = res;
                this.isLoading = false;
            });
    }

    private getContainerClass() {
        if(this.isLoading) {
            return 'slds-align--absolute-center';
        } else {
            return '';
        }
    }
}
