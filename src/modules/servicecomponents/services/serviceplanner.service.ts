import {Injectable} from "@angular/core";
import {ServicePlannerEventI, ServicePlannerRecordI} from "../interfaces/servicecomponents.interfaces";

/**
 * to help communicating between the service planner components
 */
@Injectable()
export class ServicePlannerService {
    /**
     * holds the selected event from the timeline
     */
    public timelineSelectedItem: {record: ServicePlannerRecordI, event?: ServicePlannerEventI};
}
