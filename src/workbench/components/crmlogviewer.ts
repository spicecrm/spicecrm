import { Component, Input, AfterViewInit, OnInit, ViewChild, ViewContainerRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {modal} from '../../services/modal.service';

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
    private filter = { level: 'fatal', processId: '', userId: '' };
    private limit = '5000';
    private userlist: any[];
    private levels = [ 'debug', 'info', 'warn', 'deprecated', 'error', 'fatal', 'security' ];
    private userlistIndexes = {};
    private period = { year: '', month: '', day: '', hour: '' };

    constructor( private backend: backend, private metadata: metadata, private lang: language, private prefs: userpreferences, private modalservice: modal ) {
        this.backend.getRequest( 'module/Users' ).subscribe( response => {
            this.userlist = response.list;
            this.userlist.forEach( ( val, i ) => {
                this.userlistIndexes[val.id] = i;
            });
        });
    }

    private getUsername( userId ) {
        // console.log(this.userlistIndexes);
        if ( !userId || !this.userlistIndexes.hasOwnProperty( userId )) return userId;
        return this.userlist[this.userlistIndexes[userId]].user_name;
    }

    private loadData() {
        let $route = 'crmlog';
        this.isLoading = true;
        this.loaded = false;

        if ( this.period.year.length ) {
            if ( this.period.month.length ) {
                if ( this.period.day.length ) {
                    if ( this.period.hour.length ) {
                        $route += '/day/'+this.period.year+this.period.month+this.period.day+'/hour/'+this.period.hour;
                    } else {
                        $route += '/day/' + this.period.year + this.period.month + this.period.day;
                    }
                } else {
                    $route += '/month/'+this.period.year+this.period.month;
                }
            } else $route += '/year/'+this.period.year;
        }

        this.backend.getRequest( $route+'?limit=' + this.limit + '&level=' + this.filter.level + '&processId=' + this.filter.processId + '&userId=' + this.filter.userId ).subscribe( response => {
            this.lines = response.lines.reverse();
            this.lines.forEach( ( line, i ) => {
                line.date = moment.unix( line.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getDateFormat() );
                line.time = moment.unix( line.dtx ).tz( this.prefs.toUse.timezone ).format( this.prefs.getTimeFormat() );
                line.i = i;
            });
            this.loaded = true;
            this.isLoading = false;
        } );
    }

    private buttonLoad() {
        this.loadData();
    }

    private daysInMonth( month, year ) {
        return new Date( year, month, 0 ).getDate();
    }

    private get daylist() {
        let list = [];
        for ( let i=1; i <= this.daysInMonth( parseInt( this.period.month ), parseInt( this.period.year )); i++ ) list.push( ( i < 10 ? '0':'' ) + i );
        return list;
    }

    private checkYear() {
        return this.period.year.match(/^\d{4}$/);
    }

    private showLineInModal(i) {
        this.modalservice.openModal('CRMLogViewerModal' ).subscribe( modal => {
            modal.instance.date = this.lines[i].date;
            modal.instance.time = this.lines[i].time;
            modal.instance.processId = this.lines[i].pid;
            modal.instance.username = this.getUsername( this.lines[i].uid );
            modal.instance.level = this.lines[i].lev;
            modal.instance.text = this.lines[i].txt;
        });
    }

}