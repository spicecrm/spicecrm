/**
 * @module services
 */
import {Injectable, isDevMode} from '@angular/core';
import {session} from './session.service';

/**
 * no operation ...
 */
const noop = (): any => undefined;

/**
 * general service for logging
 */
@Injectable()
export class loggerService {

    public sessionService: session;

    /**
     * getter for
     */
    get info() {
        if (this.isDev()) return console.info.bind(console);
        else return noop;
    }

    get warn() {
        if (this.isDev()) return console.warn.bind(console);
        else return noop;
    }

    get log() {
        if (this.isDev()) return console.log.bind(console);
        else return noop;
    }

    get error() {
        if (this.isDev()) return console.error.bind(console);
        else return noop;
    }

    /**
     * @ignore
     *
     * returns if we are in angular in the developer mode
     */
    public isDev() {
        return isDevMode() || (this.sessionService && this.sessionService.isDev);
    }

    /**
     * set the session service. This is needed because the logger is instantiated before the session service. The sessionservice finds the logger service then and sets the session there.
     *
     * @param service the service itself
     */
    public setSession(service) {
        this.sessionService = service;
    }

}
