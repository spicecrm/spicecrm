import {Injectable, signal, WritableSignal} from '@angular/core';
import libMoment from 'moment';
declare var moment: typeof libMoment;

@Injectable({
    providedIn: 'root'
})
export class MomentService {
    /**
     * holds the weekdays with first two letters
     */
    public weekdaysMin: WritableSignal<string[]> = signal(moment.weekdaysMin(true));
    /**
     * holds the weekdays short version
     */
    public weekdaysShort: WritableSignal<string[]> = signal(moment.weekdaysShort(true));

    /**
     * set locale data globally for moment
     * This should be only set when the language or user calendar preferences are changed
     * @param language
     * @param weekStartDay
     */
    public setLocale(language: string, weekStartDay?: string) {

        language = language.substring(0, 2);

        if (weekStartDay) {
            const localeSpecs = {
                week: {
                    dow: weekStartDay == 'Monday' ? 1 : 0,
                    doy: weekStartDay == 'Monday' ? 4 : 6
                }
            };
            moment.updateLocale(language, localeSpecs);
        } else {
            moment.locale(language);
        }
        this.weekdaysShort.set(moment.weekdaysShort(true));
        this.weekdaysMin.set(moment.weekdaysMin(true));
    }
}