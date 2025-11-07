/**
 * @module ModuleActivities
 */
import {Component, Injector, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {activitiytimeline} from '../../../services/activitiytimeline.service';
import {layout} from "../../../services/layout.service";
import {view} from "../../../services/view.service";
import {Subscription} from "rxjs";
import {socket} from "../../../services/socket.service";


@Component({
    selector: 'activity-textmessages-chat',
    templateUrl: '../templates/activitytextmessageschat.html',
    providers: [activitiytimeline, view],
    standalone: false
})
export class ActivityTextMessagesChat implements OnInit, OnDestroy {

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * holds any subscruptiuon
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * a reference to the chat container
     */
    @ViewChild('chatcontainer', {read: ViewContainerRef, static: true}) public chatcontainer: ViewContainerRef;

    /**
     * a reference to the add container
     */
    @ViewChild('addcontainer', {read: ViewContainerRef, static: true}) public addcontainer: ViewContainerRef;

    /**
     * indicate that we are initialized
     */
    public initialized: boolean = false;

    constructor(
        public model: model,
        public view: view,
        public activitiytimeline: activitiytimeline,
        public layout: layout,
        public socket: socket
    ) {
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.activitiytimeline.parent = this.model;
        this.activitiytimeline.usefts = true;
        this.activitiytimeline.defaultLimit = 100;
        this.activitiytimeline.filters.objectfilters = ['TextMessages'];

        this.reload();

        this.connectSocket();
    }

    /**
     * stops the subscription
     */
    public ngOnDestroy() {
        this.activitiytimeline.stopSubscriptions();
        this.subscriptions.unsubscribe();
        this.disconnectSocket()
    }

    /**
     * gets the container style in the proper height
     */
    get containerStyle(){
        if(!this.addcontainer) return undefined;

        let clientRect = this.addcontainer.element.nativeElement.getBoundingClientRect();
        let height = clientRect.height + 15;


        return {
            height: `calc(100% - ${height}px)`
        }

    }

    /**
     * reloads the activities stream
     */
    public reload() {
        this.activitiytimeline.getTimeLineData('History').subscribe({
            next: (res) => {
                window.setTimeout(() => {
                    this.scrollToBottom();
                }, 0);

                // set that we are initialized
                this.initialized = true;
            }
        });
    }

    /**
     * getter for the chat messages
     */
    get chatMessages() {
        return this.activitiytimeline.activities.History.list.sort((a, b) => a.data.date_sent > b.data.date_sent ? -1 : 1);
    }

    /**
     * a helper function to scroll the container to the bottom .. newest message is at the bottom
     */
    public scrollToBottom(){
        let nElement = this.chatcontainer.element.nativeElement;
        nElement.scrollTop = nElement.scrollHeight;
    }

    /**
     * connect to the socket
     */
    public connectSocket() {

        this.subscriptions.add(
            this.socket.initializeNamespace('activitytextmessageschat').subscribe(event => {
                if(event.data) this.handleCallEvent(event.data);
            })
        );

        // join the room
        // ToDo: ensure that the joining the room is authorized
        this.socket.joinRoom('activitytextmessageschat', `activitytextmessageschat::${this.model.id}`);

    }

    /**
     * disconnect from the socket
     */
    public disconnectSocket() {
        if (this.socket) {
            this.socket.leaveRoom('activitytextmessageschat', `activitytextmessageschat::${this.model.id}`);
        }
    }

    /**
     * handle the event from the socket
     *
     * @param eventData
     */
    public handleCallEvent(eventData: any) {
        this.reload();
    }

}
