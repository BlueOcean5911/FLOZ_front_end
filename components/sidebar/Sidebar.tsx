"use client"

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Bars3Icon, ChevronDownIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useAuthContext } from "@/contexts/AuthContext";
import { getProjects } from '@service/project.service';
import { IPerson, IProject } from '@models';
import SidebarTreeView from '@components/treeview/SidebarTreeview';

type TreeNode = {
  label: string;
  children?: TreeNode[];
};

type TreeViewProps = {
  nodes: TreeNode[];
};

type SidebarProps = {
  persons: IPerson[];
  projects: IProject[];
}

const TreeView: React.FC<TreeViewProps> = ({ nodes }) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const toggleNode = (nodeId: string) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter((id) => id !== nodeId));
    } else {
      setExpandedNodes([...expandedNodes, nodeId]);
    }
  };

  const renderTreeItems = (nodes: TreeNode[]) => {
    return nodes.map((node) => (
      <div key={node.label}>
        <div
          className={`flex items-center cursor-pointer `}
          onClick={() => toggleNode(node.label)}
        >
          {node.children ? (
            <span className="mr-2">
              {expandedNodes.includes(node.label) ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
            </span>
          ) : (
            <span className="mr-6" />
          )}
          <span>{node.label}</span>
        </div>
        {node.children && expandedNodes.includes(node.label) && (
          <div className="pl-8">{renderTreeItems(node.children)}</div>
        )}
      </div>
    ));
  };

  return <div>{renderTreeItems(nodes)}</div>;
};

const Sidebar: React.FC<SidebarProps> = ({ persons, projects }) => {
  const [peoples, setPeoples] = useState<any>(persons);
  const [treeData, setTreeData] = useState<TreeNode[]>([
    {
      label: 'Floz team',
      children: [
        { label: 'Dashboard' },
        { label: 'News' },
        ...(peoples.length > 0
          ? peoples.map((item) => {
            item.label = item.name;
            item.children = [{ label: 'profile' }];
            return item;
          })
          : []),
      ],
    },
    {
      label: 'Projects',
      children: projects.length > 0 ? projects.map((item) => ({
        label: (
          <Link key={item._id} href={`/dashboard/project/${item._id}`}>
            {item.name}
          </Link>
        ),
        children: [
          {
            label: (
              <Link href={`/dashboard/project/${item._id}/meeting`}>
                {"Manage Meetings"}
              </Link>
            )
          }
        ],
      })) : [],
    },
  ]);

  React.useEffect(() => {
    if (persons.length > 0) setPeoples(persons);

    if (peoples.length > 0 && projects.length > 0) {
      setTreeData([
        {
          label: 'Floz team',
          children: [
            { label: 'Dashboard' },
            { label: 'News' },
            ...(peoples.length > 0
              ? peoples.map((item) => {
                item.label = item.name;
                item.children = [{ label: 'profile' }];
                return item;
              })
              : []),
          ],
        },
        {
          label: 'Projects',
          children: projects.length > 0 ? projects.map((item) => ({
            label: (
              <Link key={item._id} href={`/dashboard/project/${item._id}`}>
                {item.name}
              </Link>
            ),
            children: [{
              label: (
                <Link href={`/dashboard/project/${item._id}/meeting`}>
                  {"Manage Meeting"}
                </Link>
              )
            }],
          })) : [],
        },
      ])
    }
  }, [persons, projects])

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <button className='fixed bottom-16  left-4 sm:hidden bg-lightTone p-1 rounded-md' onClick={() => setIsMobileOpen(true)}><Bars3Icon className='w-6 h-6' /></button>
      <div className={`${isMobileOpen ? "z-[100] bg-white fixed top-0 left-0 w-full h-full overflow-auto" : "hidden sm:block w-full h-full"} `}>
        <div className='flex justify-end'>
          <button className='relative top-4 right-4 sm:hidden' onClick={() => setIsMobileOpen(false)}><XMarkIcon className='w-6 h-6' /></button>
        </div>
        <div className='sidebar flex flex-col p-4 gap-4 overflow-auto h-fit'>

          <div className='sidebar-title text-xl font-bold'>Main Workspace</div>
          <input type="text" placeholder="Search project/team name" className="w-full p-1 rounded-md border-2 border-solid border-gray-400" />

          <div className='sidebar-main overflow-auto h-fit flex flex-col'>
            {/* <TreeView nodes={treeData} /> */}
            <SidebarTreeView data={{
              people:peoples as [{_id:string, name:string}],
              projects:projects as [{_id:string, name:string}]
              }}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;