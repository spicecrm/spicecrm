import {Injectable} from "@angular/core";
import {ServicePlannerEventI} from "../interfaces/servicecomponents.interfaces";

/**
 * to help communicating between the service planner components
 */
@Injectable()
export class ServicePlannerService {
    /**
     * holds the selected event from the timeline
     */
    public timelineSelectedEvent: ServicePlannerEventI;
}
