import ProjectItems from "@components/ProjectItems/ProjectItems";
import React from "react";

function page() {
    // fetch all project here
    const projects = [
      { id: "1", name: "Project 1" },
      { id: "2", name: "Project 2" },
      { id: "3", name: "Project 3" },
      { id: "4", name: "Project 4" },
      { id: "5", name: "Project 5" },
      { id: "6", name: "Project 6" },
    ];

  return (
    <div className="m-20">
      <ProjectItems projects={projects} />
    </div>
  );
}

export default page;
