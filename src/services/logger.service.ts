import { Injectable, isDevMode } from '@angular/core';
import { session } from './session.service';

const noop = (): any => undefined;

@Injectable()
export class loggerService {

    private sessionService: session;

    get info() {
        if ( this.isDev() ) return console.info.bind( console );
        else return noop;
    }

    get warn() {
        if ( this.isDev() ) return console.warn.bind( console );
        else return noop;
    }

    get log() {
        if ( this.isDev() ) return console.log.bind( console );
        else return noop;
    }

    get error() {
        if ( this.isDev() ) return console.error.bind( console );
        else return noop;
    }

    private isDev() {
        return isDevMode() || ( this.sessionService && this.sessionService.isDev );
    }

    public setSession( service ) {
        this.sessionService = service;
    }

}
