import api from '../api/api';
import Meeting from '../models/meeting.model';

export const updateMeeting = async (id: string, meeting: Meeting) => {
    const resp = await api.patch(`/meetings/${id}`, meeting);
    const updatedMeeting = resp.data?.data;
    return updatedMeeting;
}

export const getMeeting = async (id: string) => {
    const resp = await api.get(`/meetings/${id}`);
    const meeting = resp.data?.data;
    return meeting;

}

export const createMeeting = async (meeting: Meeting) => {
    const resp = await api.post('/meetings', meeting);
    const newMeeting = resp.data?.data;
    return newMeeting;

}

export const getMeetings = async () => {
    const resp = await api.get('/meetings');
    const meetings = resp.data?.data || [];
    return meetings;
}