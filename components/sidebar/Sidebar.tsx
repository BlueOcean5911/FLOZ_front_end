"use client"

import * as React from 'react';
import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

type TreeNode = {
  label: string;
  children?: TreeNode[];
};

type TreeViewProps = {
  nodes: TreeNode[];
};

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

type SidebarProps = {
  projects: any; // Replace 'any' with the actual type of 'projects'
  peoples: any; // Replace 'any' with the actual type of 'peoples'
};

const Sidebar: React.FC<SidebarProps> = ({ projects, peoples }) => {
  const treeData: TreeNode[] = [
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
        children: [{ label: 'sub_project' }],
      })) : [],
    },
  ];


  return (
    <div className='sidebar flex flex-col p-4 gap-4'>

      <div className='sidebar-title text-lg font-bold'>Main Workspace</div>
      <input type="text" placeholder="Search project/team name" className="w-11/12 p-1 rounded-md border-2 border-solid border-gray-400" />

      <div className='sidebar-main flex flex-col'>
        <TreeView nodes={treeData} />
      </div>
    </div>
  );
};

export default Sidebar;