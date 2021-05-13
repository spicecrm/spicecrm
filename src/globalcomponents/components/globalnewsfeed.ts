/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

/**
 * renders a bar on the login screen with a newsfeed from a wordpress site
 */
@Component({
    selector: 'global-newsfeed',
    templateUrl: './src/globalcomponents/templates/globalnewsfeed.html',
})
export class GlobalNewsFeed {

    /**
     * the news items to be displayed
     * @private
     */
    private news: any[] = [];

    /**
     * an indicator while the news feed is being retrieved
     * @private
     */
    private isLoading: boolean = true;

    constructor(private http: HttpClient) {
        this.loadNewsFeed();
    }

    /**
     * loads the newsfeedb
     *
     * ToDo: add capability to configure newsfeed url
     *
     * @private
     */
    private loadNewsFeed(){
        let posturl = btoa('https://www.spicecrm.com/wp-json/wp/v2/posts?context=embed');
        this.http.get('proxy?useurl=' + posturl)
            .subscribe((res: any) => {
                this.news = res;
                this.isLoading = false;
            });
    }

}
