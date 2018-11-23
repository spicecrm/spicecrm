import { Component, Input, AfterViewInit, OnInit, ViewChild, ViewContainerRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import { userpreferences } from '../../services/userpreferences.service';

declare var moment: any;

@Pipe({
    name: 'textfilter',
    pure: false
})
export class TextFilterPipe implements PipeTransform {
    public transform( items: any[], filter: string ): any[] {
        if (!items || !filter ) return items;
        return items.filter(item => item.title.indexOf(filter) !== -1 );
    }
}

@Component({
    templateUrl: './src/workbench/templates/crmlogviewer.html'
})
export class CRMLogViewer {

    private lines = [];
    private page = 1;
    private isLoading = false;
    private loaded = false;
    private filter = { level: 'fatal', processId: '', username: '' };
    private limit = '5000';

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences ) {
      //  this.loadData();
    }

    private loadData() {
        this.isLoading = true;
        this.loaded = false;
        this.backend.getRequest( 'crmlog/file/0?limit=' + this.limit + '&level=' + this.filter.level + '&processId=' + this.filter.processId + '&username=' + this.filter.username ).subscribe( response => {
            this.lines = response.lines.reverse();
            for( let line of this.lines ) {
                line.date = moment.parseZone( line.datetime ).tz( this.prefs.toUse.timezone ).format( this.prefs.getDateFormat() );
                line.time = moment.parseZone( line.datetime ).tz( this.prefs.toUse.timezone ).format( this.prefs.getTimeFormat() );
            }
            this.loaded = true;
            this.isLoading = false;
        } );
    }

    private buttonLoad() {
        this.loadData();
    }

}
