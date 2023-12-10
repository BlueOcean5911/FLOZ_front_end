
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FlozIcon from '@components/icons/floz.icon';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem, TreeItemProps, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import ProjectIcon from '@components/icons/project.icon';
import Link from 'next/link';

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  bgColorForDarkMode?: string;
  color?: string;
  colorForDarkMode?: string;
  labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
  link?: string
};

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '&.Mui-expanded': {
      fontWeight: theme.typography.fontWeightRegular,
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
      borderLeft: "4px solid #349989"
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
})) as unknown as typeof TreeItem;

const StyledTreeItem = React.forwardRef(function StyledTreeItem(
  props: StyledTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const theme = useTheme();
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    link,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  const styleProps = {
    '--tree-view-color': theme.palette.mode !== 'dark' ? color : colorForDarkMode,
    '--tree-view-bg-color':
      theme.palette.mode !== 'dark' ? bgColor : bgColorForDarkMode,
  };
  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
            pr: 0,
          }}
          // onClick={() => {
          //   if (link) {
          //     window.location.href = link;
          //   }
          // }}
        >

          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
            <Link href={link ? link : '#'}  key={link} passHref={true} legacyBehavior>
              <a>{labelText}</a>
            </Link>
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

const projectsData = [
  {
    _id: "656f6ac39a892ebf1331e2ab",
    name: 'project 1',
  },
  {
    _id: "656f6acd9a892ebf1331e2ae",
    name: 'project 2',
  },
  {
    _id: "656f6adb9a892ebf1331e2b1",
    name: 'project 3',
  },
  {
    _id: "6571c13348ac192a482e5e09",
    name: 'project 4',
  },
]

export default function SidebarTreeView({ data }: {
  data: {
    projects: [{
      _id: string,
      name: string,
    }]
    , people: [{
      _id: string,
      name: string,
    }]
  }
}) {
  return (
    <TreeView
      aria-label="sidebar"
      defaultExpanded={['3']}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: '100%', flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <StyledTreeItem nodeId="1" labelText="Floz" labelIcon={FlozIcon} >
        {
          data.people.map((person) => {
            return (
              <StyledTreeItem
                key={person._id}
                nodeId={person._id}
                labelText={person.name}
                labelIcon={SupervisorAccountIcon}
              >
                <StyledTreeItem
                  key={`${person._id}1`}
                  nodeId={`${person._id}1`}
                  labelText={'Profile'}
                  labelIcon={LocalOfferIcon}
                />
              </StyledTreeItem>
            )
          })
        }
      </StyledTreeItem>
      <StyledTreeItem nodeId="3" labelText="Projects" labelIcon={ProjectIcon}>
        {
          data.projects.map((project) => {
            return (
              <StyledTreeItem
                key={project._id}
                nodeId={project._id}
                labelText={project.name}
                labelIcon={LocalOfferIcon}
              >
                <StyledTreeItem
                  key={`${project._id}1`}
                  nodeId={`${project._id}1`}
                  labelText={'Manage your meeting'}
                  labelIcon={LocalOfferIcon}
                  link={`/dashboard/project/${project._id}/meeting`}
                  onClick={() => { }}
                />
              </StyledTreeItem>
            )
          })
        }
        {/* <StyledTreeItem
          nodeId="4"
          labelText="Social"
          labelIcon={SupervisorAccountIcon}
          labelInfo="90"
          color="#1a73e8"
          bgColor="#e8f0fe"
          colorForDarkMode="#B8E7FB"
          bgColorForDarkMode="#071318"
        />
        <StyledTreeItem
          nodeId="6"
          labelText="Updates"
          labelIcon={InfoIcon}
          labelInfo="2,294"
          color="#e3742f"
          bgColor="#fcefe3"
          colorForDarkMode="#FFE2B7"
          bgColorForDarkMode="#191207"
        />
        <StyledTreeItem
          nodeId="7"
          labelText="Forums"
          labelIcon={ForumIcon}
          labelInfo="3,566"
          color="#a250f5"
          bgColor="#f3e8fd"
          colorForDarkMode="#D9B8FB"
          bgColorForDarkMode="#100719"
        />
        <StyledTreeItem
          nodeId="8"
          labelText="Promotions"
          labelIcon={LocalOfferIcon}
          labelInfo="733"
          color="#3c8039"
          bgColor="#e6f4ea"
          colorForDarkMode="#CCE8CD"
          bgColorForDarkMode="#0C130D"
        /> */}
      </StyledTreeItem>
      <StyledTreeItem nodeId="5" labelText="History" labelIcon={Label} />
    </TreeView>
  );
}
