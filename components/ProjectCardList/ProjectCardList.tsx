"use client"

import {IProject} from "@./models/project.model";
import {useState} from "react";
import ProjectCardItem from "@components/ProjectCardList/ProjectCardItem";

// home page project card list component
export default function ProjectCardList({
                                            projects,
                                        }: {
    projects: IProject[] | null;
}) {
    const [pros, setPros] = useState<IProject[] | null>(projects)
    //console.log(pros)
    return (
        <div className="flex flex-nowrap overflow-x-auto">
            {
                pros.map((pro)=>{
                    return <ProjectCardItem project={pro} key={pro._id}></ProjectCardItem>
                })
            }
        </div>
    )
}