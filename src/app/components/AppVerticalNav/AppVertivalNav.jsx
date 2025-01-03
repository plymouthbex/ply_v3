import { Box, ButtonBase, Icon, styled, useMediaQuery, useTheme }  from '@mui/material'
import useSettings from 'app/hooks/useSettings'
import { NavLink } from 'react-router-dom'
import { Paragraph,Span } from '../Typography'
import AppVerticalNavExpansionPannel from './AppVerticalNavExpansionPannel'
import React,{ Fragment} from 'react'
import useAuth from 'app/hooks/useAuth'




const ListLabel = styled(Paragraph)(({ theme, mode }) => ({
  fontSize: '12px',
  marginTop: '5px',
  marginLeft: '15px',
  marginBottom: '5px',
  textTransform: 'uppercase',
  display: mode === 'compact' && 'none',
  color: theme.palette.text.secondary,
}));

const ExtAndIntCommon = {
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '4px',
  height: 27,
  whiteSpace: 'pre',
  marginBottom: '8px',
  textDecoration: 'none',
  justifyContent: 'space-between',
  transition: 'all 150ms ease-in',
  '&:hover': { background: 'rgba(255, 255, 255, 0.08)' },
  '&.compactNavItem': {
    overflow: 'hidden',
    justifyContent: 'center !important',
  },
  '& .icon': {
    fontSize: '18px',
    paddingLeft: '16px',
    paddingRight: '16px',
    verticalAlign: 'middle',
  },
};
const ExternalLink = styled('a')(({ theme }) => ({
  ...ExtAndIntCommon,
  color: theme.palette.text.primary,
}));

const InternalLink = styled(Box)(({ theme }) => ({
  '& a': {
    ...ExtAndIntCommon,
    color: theme.palette.text.primary,
  },
  '& .navItemActive': {
    backgroundColor: 'rgba(22, 77, 80, 0.16)',
  },
}));

const StyledText = styled(Span)(({ mode }) => ({
  fontSize: '0.875rem',
  paddingLeft: '0.8rem',
  display: mode === 'compact' && 'none',
}));

const BulletIcon = styled('div')(({ theme }) => ({
  padding: '2px',
  marginLeft: '24px',
  marginRight: '8px',
  overflow: 'hidden',
  borderRadius: '300px',
  background: theme.palette.text.primary,
}));

const BadgeValue = styled('div')(() => ({
  padding: '1px 8px',
  overflow: 'hidden',
  borderRadius: '300px',
}));

const AppVertivalNav = ({ items }) => {
  const { settings,updateSettings } = useSettings();
  const { user } = useAuth()
  const { mode } = settings.layout1Settings.leftSidebar;
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));

  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };
  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "mobile" ? "close" : "mobile";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "full" : "close";
    }
    updateSidebarMode({ mode });
  };

  const renderLevels = (data,ifChild) => {
    return data.map((item, index) => {
      if (item.type === 'label')
        return (
          <ListLabel key={index} mode={mode} className="sidenavHoverShow">
            {item.label}
          </ListLabel>
        );

      if (item.children) {
        // console.log("🚀 ~ file: AppVertivalNav.jsx:93 ~ returndata.map ~ item.children:", item.children)
        
        return (
          <AppVerticalNavExpansionPannel mode={mode} item={item} key={index}>
            {renderLevels(item.children,true)}
          </AppVerticalNavExpansionPannel>
        );
      } else if (item.type === 'extLink') {
        return (
          <ExternalLink
            key={index}
            href={item.path}
            className={`${mode === 'compact' && 'compactNavItem'}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <ButtonBase key={item.name} name="child" sx={{ width: '100%' }}>
              {(() => {
                if (item.icon) {
                  return <Icon className="icon">{item.icon}</Icon>;
                } else {
                  return <span className="item-icon icon-text">{item.iconText}</span>;
                }
              })()}
              <StyledText mode={mode} className="sidenavHoverShow">
                {item.name}
              </StyledText>
              <Box mx="auto"></Box>
              {item.badge && <BadgeValue>{item.badge.value}</BadgeValue>}
            </ButtonBase>
          </ExternalLink>
        );
      } else { 
        if(item.role.includes(user.role)){
        return (
          <InternalLink key={index}>
            <NavLink
              to={item.path}
              state={{accessID:item.accessID}}
              className={({ isActive }) =>
                isActive
                  ? `navItemActive ${mode === 'compact' && 'compactNavItem'}`
                  : `${mode === 'compact' && 'compactNavItem'}`
              }
            >
              <ButtonBase onClick={handleSidebarToggle}  key={item.name} name="child" sx={{ width: '100%',paddingLeft: ifChild ?"10px" : "0px"}}>
                {item?.icon ? (
                  <Icon className="icon" sx={{ width: 36 }}>
                    {item.icon}
                  </Icon>
                ) : (
                  <Fragment>
                    <BulletIcon
                      className={`nav-bullet`}
                      sx={{ display: mode === 'compact' && 'none' }}
                    />
                    <Box
                      className="nav-bullet-text"
                      sx={{
                        ml: '10px',
                        fontSize: '11px',
                        display: mode !== 'compact' && 'none',
                      }}
                    >
                      {item.iconText}
                    </Box>
                  </Fragment>
                )}
                <StyledText mode={mode} className="sidenavHoverShow">
                  {item.name}
                </StyledText>

                <Box mx="auto" />

                {item.badge && (
                  <BadgeValue className="sidenavHoverShow">{item.badge.value}</BadgeValue>
                )}
              </ButtonBase>
            </NavLink>
          </InternalLink>
        );}
      }
    });
  };

  return <div className="navigation">{renderLevels(items,false)}</div>;
};
  
  export default React.memo(AppVertivalNav);