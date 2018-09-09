
import {Subject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {modelutilities} from '../../../services/modelutilities.service';


declare var moment: any;

@Injectable()
export class calendar {

    calendars: any = {};
    currentStart: any = null;
    currentEnd: any = null;
    sheetHourHeight: number = 80;

    constructor(private backend: backend, private session: session, private modelutilities: modelutilities) {
    }

    loadEvents(start, end, calendar = this.session.authData.userId) {
        // check if we need to reload
        if(!this.currentStart || !this.currentEnd || this.currentStart > start || this.currentEnd < end) {
            // set current serach paramaters
            this.currentEnd = end;
            this.currentStart = start;

            let responseSubject = new Subject<Array<any>>();
            let params = {
                start: start.format('YYYY-MM-DD HH:mm:ss'),
                end: end.format('YYYY-MM-DD HH:mm:ss')
            }
            this.backend.getRequest('calendar/' + calendar, params).subscribe(events => {
                this.calendars[calendar] = [];
                for (let event of events) {
                    event.data = this.modelutilities.backendModel2spice('Meetings', event.data);
                    switch (event.type) {
                        case 'event':
                            event.start = moment(event.start).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                            event.end = moment(event.end).tz(moment.tz.guess()).add(moment().utcOffset(), 'm');
                            break;
                    }
                    this.calendars[calendar].push(event);
                }

                responseSubject.next(this.calendars[calendar]);
                responseSubject.complete();
            });

            return responseSubject.asObservable();
        } else {
            // filter the current eventset based on the start and end date
            // todo: not proper filtering yet for multi day events
            let filteredEntries: Array<any> = [];
            for(let event of this.calendars[calendar]){
                if(event.start >= start && event.end <= end)
                    filteredEntries.push(event);
            };
            return Observable.of(filteredEntries);
        }
    }

    getEvents(calendar = this.session.authData.userId) {
        return this.calendars[calendar] ? this.calendars[calendar] : [];
    }

    // internal function to manage the display .. adding diaplyindex and overly count to each event
    arrangeEvents(events) {

        // sort the events
        events.sort((a, b) => {
            if (a.start < b.start)
                return -1;
            if (a.start === b.start) {
                if (a.end > b.end)
                    return -1;
                else
                    return 1;
            }
            return 1;
        });
        // assess overlaps
        let calendarOverlay = {};
        for (let _event of events) {
            let elementsOverlaid = [];
            for (let _ovEvent of events) {
                // only the ones we did not handle yet
                // if we have an overlay ... add it
                if (_event.id !== _ovEvent.id && _ovEvent.start < _event.end && _ovEvent.end > _event.start)
                    elementsOverlaid.push({
                        id: _ovEvent.id,
                        start: _ovEvent.start,
                        end: _ovEvent.end
                    });
            }
            ;

            // determine the max number in parallel per event
            var _maxOverlay = 0;
            if (elementsOverlaid.length > 0) {
                //angular.forEach(elementsOverlaid, function (_element) {
                for (let _element of elementsOverlaid) {
                    let _elementOverlayCount = 0;
                    //angular.forEach(elementsOverlaid, function (_ovElement) {
                    for (let _ovElement of elementsOverlaid) {
                        if (_ovElement.start < _element.end && _ovElement.end > _element.start)
                            _elementOverlayCount++;
                    }
                    if (_elementOverlayCount > _maxOverlay)
                        _maxOverlay = _elementOverlayCount;
                }
                _maxOverlay++;
            }

            calendarOverlay[_event.id] = {
                maxOverlay: _maxOverlay,
                elementsOverlaid: elementsOverlaid
            };
        }

        // determine the display index for all elements
        let handledEvents = [];
        // angular.forEach(_calendarService.calendarEvents, function (_event) {
        for (let _event of events) {
            let _displayIndex = 0;
            let _usedIndexes = [];
            //angular.forEach(_calendarService.calendarEvents, function (_ovEvent) {
            for (let _ovEvent of events) {
                if (handledEvents.indexOf(_ovEvent.id) !== -1 && _ovEvent.start < _event.end && _ovEvent.end > _event.start) {
                    if (_usedIndexes.indexOf(calendarOverlay[_ovEvent.id].displayIndex) === -1)
                        _usedIndexes.push(calendarOverlay[_ovEvent.id].displayIndex);
                    while (_usedIndexes.indexOf(_displayIndex) !== -1) {
                        _displayIndex++;
                    }
                }
            }
            calendarOverlay[_event.id].displayIndex = _displayIndex;
            handledEvents.push(_event.id);
        }


        // finally prpgate to see if any of the nested overlaid elements has a higher max Overly v alue
        //angular.forEach(_calendarService.calendarEventsOverlay, function (_overlayData, _overlayId) {
        for (let _overlayid in calendarOverlay) {
            //angular.forEach(_overlayData.elementsOverlaid, function (_ovOverlayData) {
            for (let _ooverlay of calendarOverlay[_overlayid].elementsOverlaid) {
                if (calendarOverlay[_overlayid].maxOverlay < calendarOverlay[_ooverlay.id].maxOverlay)
                    calendarOverlay[_overlayid].maxOverlay = calendarOverlay[_ooverlay.id].maxOverlay;
            }
            ;
        }
        ;


        for (let _event of events) {
            _event.displayIndex = calendarOverlay[_event.id].displayIndex;
            _event.maxOverlay = calendarOverlay[_event.id].maxOverlay;
        }

        return events;

    }

}