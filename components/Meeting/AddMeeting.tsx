import React, { useState, Fragment, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ChevronRightIcon } from "@heroicons/react/20/solid";
import moment, { Moment } from "moment";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterMoment } from '@mui/x-date-pickers-pro/AdapterMoment';
import { DateCalendar, StaticDatePicker, DatePicker, TimePicker } from "@mui/x-date-pickers";

import { Checkbox, ListItemText, OutlinedInput, Typography } from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconSearch from "@components/icons/IconSearch";
import { getProjects, updateProject } from "@service/project.service";
import { getPersons, getPersonsByOrganization } from "@service/person.service";
import { createMeeting, deleteMeeting, getMeeting, updateMeeting as updateMeetingDb } from "@service/meeting.service";
import { useAuthContext } from "@contexts/AuthContext";
import { createEvent } from "@service/event.service";
import axios, { AxiosRequestConfig } from "axios";
import { SketchPicker } from 'react-color'
import { IPerson, Meeting } from "@models";
import { getUserByEmail } from "@service/user.service";
import { success } from "@utils/nitification.utils";
import { updateGoogleCalendarMeeting } from "@utils/googlecalendar.utils";
import { getCookie } from "cookies-next";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddMeeting = ({
    children,
    providerToken,
    userId,
    projectId,
    meetingId = '',
    isOpen: isAddMeetingModalOpen = false,
    startAndEndDate,
    updateProjectColorMap,
    setIsOpen: setIsAddmeetingModalOpen,
    onNewMeeting
}: {
    children?: React.ReactNode;
    providerToken?: string;
    userId?: string;
    projectId?: string;
    meetingId?: string;
    isOpen?: boolean;
    startAndEndDate?: {
        start: string,
        end: string,
    },
    updateProjectColorMap?: (val) => void
    setIsOpen?: (val: boolean) => void;
    onNewMeeting?: () => void
}) => {

    const [isOpen, setIsOpen] = useState(isAddMeetingModalOpen);
    const [selectedPersonEmailList, setSelectedPersonEmailList] = useState<string[]>([]);
    const { user } = useAuthContext();
    const { signOut } = useAuthContext();

    // Start and End date that reflect to the calendar 
    const [summary, setSummary] = useState('');
    const [startDate, setStartDate] = useState<Moment | null>(moment().startOf('day'));
    const [endDate, setEndDate] = useState<Moment | null>(moment().startOf('day').add(30, 'minutes'));
    const [description, setDescription] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedProject, setSelectedProject] = useState<string>(projectId);
    const [allProjects, setAllProjects] = useState([]);
    const [topic, setTopic] = useState('');
    const [isPickColorOpen, setIsPickColorOpen] = useState(false)
    const [projectColor, setProjectColor] = useState('#349989');
    const [projectColorMap, setProjectColorMap] = useState<Record<string, number>[]>([]);

    const refreshToken = getCookie("r_token");

    const fetchAllProjects = async () => {
        const tempProjects = await getProjects({ userId: userId });
        const tempProjectColorMap = [];
        for (let i = 0; i < tempProjects.length; i++) {
            tempProjectColorMap[tempProjects[i]._id] = tempProjects[i].color;
        }
        // console.log("temp allProjects before set--------->", allProjects);
        setAllProjects(tempProjects);
        setProjectColorMap(tempProjectColorMap);
        // console.log("temp allProjects after--------->", allProjects);
        return;
    };


    const fetchAllUsers = async () => {
        const users = await getPersonsByOrganization(user?.organization);
        setUsers(users);
    }
    useEffect(() => {
        if (isOpen) {
            fetchAllProjects();
            fetchAllUsers();
            if (meetingId !== '') {
                initilaizeMeetingProperty();
            }
            console.log(123);
        }
    }, [isOpen]);

    useEffect(() => {
        if (startAndEndDate) {
            setStartDate(moment(startAndEndDate.start));
            setEndDate(moment(startAndEndDate.end));
        }
        setIsOpen(isAddMeetingModalOpen);
        console.log("isaddmeeting")
    }, [isAddMeetingModalOpen])

    useEffect(() => {
        console.log("selected project")
        setProjectColor(projectColorMap[selectedProject]);
    }, [selectedProject, projectColorMap])

    const initilaizeMeetingProperty = async () => {
        getMeeting(meetingId).then((meeting: Meeting) => {
            if (meeting.summary.split(' - ').length > 1) {
                setSummary(meeting.summary.split(' - ')?.at(0));
                setDescription(meeting.summary.split(' - ')?.at(1));
            } else {
                setDescription('');
                setSummary(meeting.summary);
            }
            setStartDate(moment(meeting.date));
            setEndDate(moment(meeting.date).add(meeting.period, "minutes"));
            getSelectedPersonEmailsFromAttentdees(meeting);
            getSelectedProjectIdandColor();
            setTopic(meeting.topic)
        })
    }

    const getSelectedPersonEmailsFromAttentdees = (meeting: Meeting) => {
        const tempselectedPersonEmailLists = [];
        const tempAttendees = meeting.members;
        for (let i = 0; i < tempAttendees?.length; i++) {
            tempselectedPersonEmailLists.push(tempAttendees[i]?.email);
            if (i === tempAttendees.length - 1) {
                setSelectedPersonEmailList(tempselectedPersonEmailLists);
            }
        }
    }

    const getSelectedProjectIdandColor = () => {
        setSelectedProject(projectId);
        setProjectColor(projectColorMap[projectId])
    }

    const closeModal = () => {
        setIsOpen(false);
        if (setIsAddmeetingModalOpen) {
            setIsAddmeetingModalOpen(false);
        }
    }

    const onCancel = () => {
        clearData()
        closeModal();
    }

    const onSaveNew = () => {
        //save 
        clearData();
    }

    const clearData = () => {
        setSummary("");
        setDescription("");
        setStartDate(moment().startOf('day'));
        setEndDate(moment().endOf('day'));
        setSelectedProject('');
        setSelectedPersonEmailList([]);
        setTopic('');
    }

    const handleSelected = (event: SelectChangeEvent<typeof selectedPersonEmailList>) => {
        const {
            target: { value },
        } = event;
        setSelectedPersonEmailList(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleProjectChange = (event: SelectChangeEvent) => {
        setSelectedProject(event.target.value as string);
    }

    const handleChange = (event: SelectChangeEvent) => {
        setSummary(event.target.value as string);
    };

    const onChangeDescription = (e: any) => {
        setDescription(e.target.value);
    };

    const setStartDate_date = (date) => {
        setStartDate(date)
    }

    const setStartDate_time = (time) => {
        setStartDate(time)
    }

    const setEndDate_date = (date) => {
        setEndDate(date)
    }

    const setEndDate_time = (time) => {
        setEndDate(time)
    }

    const onSave = async () => {
        const personIdList = [];
        for (const personEmail of selectedPersonEmailList) {
            personIdList.push((await getPersons({
                email: personEmail
            }))?.at(0)?._id);
        }

        const meeting = {
            date: startDate.toDate(),
            summary: `${summary} - ${description}`,
            members: personIdList,
            projectId: selectedProject,
            topic: topic,
            period: moment(endDate).diff(moment(startDate), 'minutes'),
            updatedAt: new Date(),
            createdAt: new Date(),
        };

        const resultUpdateProject = await updateProject(selectedProject, {
            color: projectColor,
        })

        projectColorMap[selectedProject] = projectColor;

        createMeeting(meeting).then((meeting) => {
            console.log(meeting, "Created meeting");
            onNewMeeting();
            saveIntoGoogleCalendar(meeting._id);
        });
        updateProjectColorMap(projectColorMap);
        closeModal();
        clearData();
        success('Successfully created the meeting!')
    };

    const saveIntoGoogleCalendar = async (meetingId) => {
        let attendees = [];

        for (const user of users) {
            if (selectedPersonEmailList.indexOf(user.email) > -1) {
                attendees.push({
                    name: user.name,
                    email: user.email,
                    responseStatus: "accepted",
                    self: true,
                });
            }
        }

        const timestamp = Date.now().toString();
        const requestId = "conference-" + timestamp;

        const event = {
            summary: summary,
            description: description ?? "",
            start: {
                dateTime: startDate.format(),
                timeZone: startDate.format('Z')
            },
            end: {
                dateTime: endDate.format(),
                timeZone: endDate.format('Z')
            },
            ...(attendees?.length && { attendees }),
            conferenceData: {
                createRequest: {
                    requestId: requestId,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet",
                    },
                },
            },
            extendedProperties: {
                private: {
                    projectId: selectedProject,
                    meetingId: meetingId,
                }
            }
        };

        const url = new URL(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events"
        );
        const params = { conferenceDataVersion: 1 };
        Object.keys(params).forEach((key) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            url.searchParams.append(key, params[key])
        );
        try {
            const headers: AxiosRequestConfig["headers"] = {
                Authorization: "Bearer " + providerToken, // Access token for google
                "Content-Type": "application/json",
            };
            const eventCreationRes = await axios.post(url.toString(),
                event,
                { headers });
            console.log(eventCreationRes.data, "EventCreationReas");
            const eventCreationResponse: { id: string, hangoutLink: string } = (await eventCreationRes.data) as { id: string, hangoutLink: string };

            const googleEventId = eventCreationResponse.id;
            const googleMeetingUrl = eventCreationResponse.hangoutLink;

            await updateMeetingDb(meetingId, {
                googleEventId,
                googleMeetingUrl,
            })

            await createEvent({
                eventId: googleEventId,
                projectId: selectedProject ? selectedProject : allProjects[0]?._id,
            });
        } catch (error) {
            await deleteMeeting(meetingId);
            signOut();
        }
    }

    const handleSave = () => {
        if (meetingId === '') {
            onSave();
        } else {
            updateMeeting();
        }
    }

    const updateMeeting = async () => {

        const personIdList = [];

        users.filter((person: IPerson) => selectedPersonEmailList.includes(person.email)).map((item: IPerson) => {
            personIdList.push(item._id)
        })

        const updateMeeting = await updateMeetingDb(meetingId, {
            summary: summary + ' - ' + description,
            date: startDate.toDate(),
            members: personIdList,
            projectId: selectedProject,
            period: moment(endDate).diff(moment(startDate), 'minutes'),
            updatedAt: new Date(),
        })

        updateGoogleCalendarMeeting(updateMeeting, providerToken, refreshToken);

        await updateProject(projectId, {
            color: projectColor,
        })

        projectColorMap[projectId] = projectColor;

        closeModal();
        clearData();
    }

    return (
        <>
            <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
                {children}
            </div>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-[719px] h-[741px] flex flex-col transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                                    <div className="title text-center text-xl p-1">
                                        {meetingId === '' ? 'New Event' : 'Edit Event'}
                                    </div>
                                    <hr className="border-b-1 border-gray-600" />

                                    <div className="body px-[30px] py-[40px] flex flex-col">
                                        <div className="subject">
                                            <div className="subject-title text-xs font-bold p-1"><span className="text-red-500">*</span> Subject</div>
                                            <div className="input-search relative border-2 border-gray-300 m1  rounded-md w-full">
                                                <FormControl fullWidth variant="standard">
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        sx={{ height: '32px' }}
                                                        value={summary}
                                                        onChange={handleChange}
                                                        IconComponent={() => (<span></span>)}
                                                    >
                                                        <MenuItem key={0} value={'Call'}>Call</MenuItem>
                                                        <MenuItem key={1} value={'Meeting'}>Meeting</MenuItem>
                                                        <MenuItem key={2} value={'Send letter/Quote'}>Send letter/Quote</MenuItem>
                                                        <MenuItem key={3} value={'Other'}>Other</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <IconSearch className="absolute right-4 top-2" />
                                            </div>
                                        </div>
                                        <div className="description flex flex-col mt-[30px]">
                                            <div className="description-title text-xs">Description</div>
                                            <textarea className=" max-h-[659px] h-[80px] border-2 border-gray-300 rounded-md" value={description} onChange={(e) => onChangeDescription(e)}></textarea>
                                        </div>
                                        <div className="period flex mt-[31px] justify-between">
                                            <div className="start-date flex flex-col  w-[303px] h-[82px] justify-between" >
                                                <div className="title text-xs font-bold">Start</div>
                                                <div className="date flex gap-1">
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Date</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['DatePicker']}>
                                                                <div className="m-w-[100px]">
                                                                    <DatePicker
                                                                        value={startDate}
                                                                        onChange={(newValue) => setStartDate_date(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Time</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['TimePicker']}>
                                                                <div className="m-w-[100px] ">
                                                                    <TimePicker
                                                                        value={startDate}
                                                                        onChange={(newValue) => setStartDate_time(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="end-date flex flex-col w-[303px] h-[82px] justify-between" >
                                                <div className="title text-xs font-bold">End</div>
                                                <div className="date flex gap-1">
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Date</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['DatePicker']}>
                                                                <div className="m-w-[100px]">

                                                                    <DatePicker
                                                                        value={endDate}
                                                                        onChange={(newValue) => setEndDate_date(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="date-title text-xs">Time</div>
                                                        <LocalizationProvider dateAdapter={AdapterMoment}>
                                                            <DemoContainer components={['TimePicker']}>
                                                                <div className="m-w-[100px]">

                                                                    <TimePicker
                                                                        value={endDate}
                                                                        onChange={(newValue) => setEndDate_time(newValue)}
                                                                    />
                                                                </div>
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="guests flex flex-col mt-[32px] mb-[12px]">
                                            <div className="guest-title text-xs font-bold p-1">Guests</div>
                                            <div className="relative border-gray-300 rounded-md w-full">
                                                <FormControl fullWidth variant="standard">
                                                    <Select
                                                        labelId="demo-multiple-checkbox-label"
                                                        id="demo-multiple-checkbox"
                                                        multiple
                                                        value={selectedPersonEmailList}
                                                        onChange={handleSelected}
                                                        input={<OutlinedInput label="Tag" />}
                                                        renderValue={(selected) => selected.join(', ')}
                                                        MenuProps={MenuProps}

                                                        sx={{ height: '32px', fontSize: '12px' }}
                                                        IconComponent={() => (<span></span>)}
                                                    >
                                                        {users.map((user, index) => (
                                                            <MenuItem key={index} value={user.email} sx={{ height: '36px' }}>
                                                                <Checkbox checked={selectedPersonEmailList.indexOf(user.email) > -1} />
                                                                <ListItemText>
                                                                    <Typography variant="body2" sx={{ fontSize: '12px', fontFamily: 'Arial' }}>
                                                                        {user.name}
                                                                    </Typography>
                                                                </ListItemText>
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <IconSearch className="absolute right-4 top-2" />
                                            </div>
                                        </div>
                                        <div className="guests flex flex-col ">
                                            <div className="guest-title text-xs font-bold p-1">Project</div>
                                            <div className="flex gap-1 items-center">
                                                <div className="border border-gray-300 rounded-md w-full">
                                                    <FormControl fullWidth variant="standard">
                                                        <Select
                                                            id="project-list"
                                                            onChange={handleProjectChange}
                                                            defaultValue={projectId}
                                                            value={selectedProject}
                                                        >
                                                            {allProjects.map((project) => {
                                                                return (
                                                                    <MenuItem key={project._id} value={project._id}>{project.name}</MenuItem>
                                                                )
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <button
                                                    onClick={() => { setIsPickColorOpen(true) }}
                                                    className={`relative w-8 h-8 rounded-lg`}
                                                    style={{ backgroundColor: `${projectColor}` }} >
                                                </button>
                                            </div>
                                        </div>

                                        <div className="guests flex flex-col mt-[16px]">
                                            <div className="guest-title text-xs font-bold p-1">Topic</div>
                                            <input
                                                value={topic}
                                                onChange={(e) => { setTopic(e.target.value) }}
                                                className="w-full border-2 border-gray-300 rounded-md p-1 pl-2 focus:outline-none" />
                                        </div>
                                    </div>
                                    <div className="h-[56px] flex justify-end align-baseline gap-3 mx-[30px]">
                                        <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={onCancel}>Cancel</button>
                                        <button className="text-[#0176D3] w-fit m-w-[10px] h-[32px] px-2 border-2 border-gray-300 rounded-md" onClick={onSaveNew}>Save & New</button>
                                        <button className="bg-[#0176D3] text-white w-fit m-w-[10px] h-[32px] px-2 border-1 border-gray-300 rounded-md" onClick={() => { handleSave() }}>Save</button>
                                    </div>

                                    {
                                        isPickColorOpen ?
                                            <>
                                                <div className="pick-color absolute w-full h-full">

                                                    <div className="h-full w-full">
                                                        <div className="flex min-h-full items-center justify-center text-center">

                                                            <div className="w-full flex flex-col p-4 justify-center items-center max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                                                <h1
                                                                    className="text-xl font-medium leading-6 text-gray-900 m-4"
                                                                >
                                                                    Pick your project color!
                                                                </h1>
                                                                <div className="mt-2">
                                                                    <SketchPicker
                                                                        color={projectColor}
                                                                        onChange={(color, event) => setProjectColor(color.hex)}
                                                                    />
                                                                </div>

                                                                <div className="mt-4 flex gap-2">
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                        onClick={() => setIsPickColorOpen(false)}
                                                                    >
                                                                        OK
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                                                        onClick={() => setIsPickColorOpen(false)}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> : <></>
                                    }
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default AddMeeting;