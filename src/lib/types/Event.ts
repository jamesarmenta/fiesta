import { DatePoll } from './Event';
type UUID = string;

export type Date = {
    epoch: number;
    timezone: string;
};

export type Timespan = {
    startDate: Date,
    endDate: Date
}

export type User = {
    id: UUID;
    name: string;
    email?: string;
    phone?: string;
}

export type Attendee = {
    userId: User['id'][];
    response: AttendeeResponse;
}

export enum AvailabilityStatus {
    'AVAILABLE',
    'UNAVAILABLE',
    'TENTATIVE',
}

export enum RsvpStatus {
    'ACCEPTED',
    'DECLINED',
    'TENTATIVE'
}

export type AttendeeResponse = {
    status: RsvpStatus;
    comment?: string;
}

export type AvailabilityWindow = {
    timespan: Timespan;
    availability: AvailabilityStatus;
}

export type Event = {
    id: UUID;
    name: string;
    description: string;
    date?: Date | Timespan;
    datePoll?: DatePoll;
    attendees: Attendee[];
}

export type DatePoll = {
    timespansAllowed: Timespan[];
    responses: {
        userId: User['id'];
        timespans: AvailabilityWindow[];
        comment?: string;
    }[];
}
