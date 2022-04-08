/**
 * @module GlobalComponents
 */
import {Component, Input, OnInit} from '@angular/core';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'global-newsfeed-item',
    templateUrl: '../templates/globalnewsfeeditem.html',

})
export class GlobalNewsFeedItem {

    @Input()public item: any = {};

   public getDate() {
        return moment(this.item.date).fromNow();
    }

   public getExcerpt() {
        return this.item.excerpt.rendered.replace('<a', '<a target="_blank"');
    }

}
