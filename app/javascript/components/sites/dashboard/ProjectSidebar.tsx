import { Icon, Layout, Menu } from "antd";
import { observer } from "mobx-react";
import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import { Routes } from "../../routing/Routes";
import { dashboardStore } from "../../stores/DashboardStore";
const { Sider } = Layout;

const SidebarTrigger = styled.div`
  width: 100%;
  height: 100%;
  background: "#fff";

  &:hover {
    background: #fcfcfc;
  }
`;

interface INavigationData {
  icon: string;
  path: string;
  text: string;
}

type IProps = RouteComponentProps<{ projectId: string }> & {};
interface IState {
  selectedItem: number;
  collapsed: boolean;
}

@observer
class ProjectSidebar extends React.Component<IProps, IState> {
  navigationData: INavigationData[] = [
    {
      icon: "home",
      path: Routes.DASHBOARD.PROJECT.replace(":projectId", this.props.match.params.projectId),
      text: "Overview"
    },
    {
      icon: "key",
      path: Routes.DASHBOARD.PROJECT_KEYS.replace(":projectId", this.props.match.params.projectId),
      text: "Keys"
    },
    {
      icon: "global",
      path: Routes.DASHBOARD.PROJECT_LANGUAGES.replace(":projectId", this.props.match.params.projectId),
      text: "Languages"
    },
    {
      icon: "download",
      path: Routes.DASHBOARD.PROJECT_EXPORT.replace(":projectId", this.props.match.params.projectId),
      text: "Export"
    },
    {
      icon: "line-chart",
      path: Routes.DASHBOARD.PROJECT_ACTIVITY.replace(":projectId", this.props.match.params.projectId),
      text: "Activity"
    },
    {
      icon: "upload",
      path: Routes.DASHBOARD.PROJECT_IMPORT.replace(":projectId", this.props.match.params.projectId),
      text: "Import"
    },
    {
      icon: "team",
      path: Routes.DASHBOARD.PROJECT_MEMBERS.replace(":projectId", this.props.match.params.projectId),
      text: "Members"
    },
    {
      icon: "tool",
      path: Routes.DASHBOARD.PROJECT_SETTINGS.replace(":projectId", this.props.match.params.projectId),
      text: "Settings"
    }
  ];

  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedItem: 0,
      collapsed: false
    };
  }

  renderMenuItems = (): JSX.Element[] => {
    return [
      (
        <Menu.Item
          key={"title"}
          title={dashboardStore.currentProject && dashboardStore.currentProject.attributes.name}
          style={{ height: 48, display: "flex", alignItems: "center", padding: "0px" }}
        >
          <Link to={Routes.DASHBOARD.PROJECT.replace(":projectId", dashboardStore.currentProject && dashboardStore.currentProject.id)} className="nav-text">
            <span style={{ fontWeight: "bold" }}>
              {!this.state.collapsed && dashboardStore.currentProject && dashboardStore.currentProject.attributes.name}
              {this.state.collapsed && dashboardStore.currentProject && dashboardStore.currentProject.attributes.name.substr(0, 2)}
            </span>
          </Link>
        </Menu.Item>
      ),
      ...this.navigationData.map((data: INavigationData, index: number) => {
        return (
          <Menu.Item key={index} title={data.text}>
            <Link to={data.path} className="nav-text">
              <Icon type={data.icon} className="nav-text" style={{ marginRight: 8 }} />
              <span>
                {data.text}
              </span>
            </Link>
          </Menu.Item>
        );
      })
    ];
  }

  getSelectedItem = (): string[] => {
    return this.navigationData.map((data: INavigationData, index: number): string => {
      if (data.path === this.props.location.pathname) {
        return index.toString();
      }
    });
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed: collapsed });
  }

  toggleSidebar = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  renderSidebarTrigger = () => {
    return (
      <SidebarTrigger style={{ background: this.state.collapsed ? "#fcfcfc" : undefined }}>
        <Icon
          type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
          onClick={this.toggleSidebar}
        />
      </SidebarTrigger>
    );
  }

  render(): JSX.Element {
    return (
      <>
        <div className="logo" />
        <Sider
          collapsible
          breakpoint="md"
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          trigger={this.renderSidebarTrigger()}
          style={{ boxShadow: "rgba(61, 172, 206, 0.05) 0px 0px 24px" }}
        >
          <Menu
            mode="inline"
            selectedKeys={this.getSelectedItem()}
            style={{ height: "100%" }}
            className="dashboard-sidebar-menu"
          >
            {this.renderMenuItems()}
          </Menu>
        </Sider>
      </>
    );
  }
}

export { ProjectSidebar };