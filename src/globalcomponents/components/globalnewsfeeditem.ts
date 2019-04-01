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
    templateUrl: './src/globalcomponents/templates/globalnewsfeeditem.html',

})
export class GlobalNewsFeedItem {

    @Input() private item: any = {}

    private getDate() {
        return moment(this.item.date).fromNow()
    }

    private getExcerpt() {
        return this.item.excerpt.rendered.replace('<a', '<a target="_blank"');
    }

}
