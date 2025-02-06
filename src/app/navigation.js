import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import { authRoles } from "./auth/authRoles";

export const navigations = [
  {
    name: "Price Book",
    icon: <FolderIcon fontSize="small" />,
    role: authRoles.user,
    children: [
      {
        name: "Print Price Book",
        path: "/pages/pricing-portal/view-price-book",
        iconText: "P",
        accessID: "PPB001",
        icon: <DescriptionIcon fontSize="small" />,
        fav: false,
      },
      {
        name: "Print Price Book Group",
        path: "/pages/pricing-portal/run-price-book",
        iconText: "PP",
        accessID: "PPB002",
        icon: <DescriptionIcon fontSize="small" />,
        fav: false,
      },

      {
        name: "New Quote",
        icon: <DescriptionIcon fontSize="small" />,
        path: "/pages/pricing-portal/new-quote/new",
        accessID: "PPB003",
        iconText: "V",
        fav: false,
      },
      {
        name: "Build A Price List",
        icon: <DescriptionIcon fontSize="small" />,
        path: "/pages/pricing-portal/build-price-list/new",
        accessID: "PPB005",
        iconText: "V",
        fav: false,
      },
      {
        name: "Templates",
        icon: <DescriptionIcon fontSize="small" />,
        path: "/pages/pricing-portal/templates",
        accessID: "PPB004",
        iconText: "QT",
        fav: false,
      },
      {
        name: "Contact Directory",
        path: "/pages/pricing-portal/contact-directory",
        iconText: "C",
        accessID: "PPB015",
        icon: <DescriptionIcon fontSize="small" />,
        role: authRoles.admin,
      },

    ],
  },

  {
    name: "Control Panel",
    icon: <FolderIcon fontSize="small" />,
    role: authRoles.admin,
    children: [
      {
        name: "Items",
        path: "/pages/control-panel/items",
        iconText: "I",
        accessID: "CP001",
        icon: <DescriptionIcon fontSize="small" />,
        role: authRoles.admin,
      },
      
      {
        name: "Categories",
        path: "/pages/control-panel/print-group",
        iconText: "P",
        accessID: "CP003",
        icon: <DescriptionIcon fontSize="small" />,
        role: authRoles.admin,
      },
      {
        name: "Price List",
        path: "/pages/control-panel/price-list",
        iconText: "P",
        accessID: "CP002",
        icon: <DescriptionIcon fontSize="small" />,
        role: authRoles.admin,
      },


      {
        name: "Price Book Group",
        path: "/pages/control-panel/run-group",
        iconText: "R",
        accessID: "CP004",
        icon: <DescriptionIcon fontSize="small" />,
        role: authRoles.admin,
      },
      {
        name: "Proprietary Items",
        path: "/pages/control-panel/proprietary-items",
        iconText: "P",
        accessID: "CP006",
        icon: <DescriptionIcon fontSize="small" />,
        role: authRoles.admin,
      },
      {
        name: "Configure Price Book",
        path: "/pages/control-panel/configure-price-book/company",
        iconText: "C",
        accessID: "CP005",
        icon: <DescriptionIcon fontSize="small" />,
        role: authRoles.admin,
      },
    ],
  },

  {
    name: "Security",
    icon: <FolderIcon fontSize="small" />,
    role: authRoles.sa,
    children: [
      {
        name: "Company",
        path: "/pages/security/company",
        iconText: "V",
        accessID: "S001",
        icon: <DescriptionIcon fontSize="small" />,
      },
      {
        name: "Menu",
        path: "/pages/security/application",
        iconText: "B",
        accessID: "S002",
        icon: <DescriptionIcon fontSize="small" />,
      },
      {
        name: "User Group",
        path: "/pages/security/user-group",
        iconText: "B",
        accessID: "S003",
        icon: <DescriptionIcon fontSize="small" />,
      },
      {
        name: "User",
        path: "/pages/security/user",
        iconText: "B",
        accessID: "S004",
        icon: <DescriptionIcon fontSize="small" />,
      },
    ],
  },
];
export const favMenu = [
  {
    name: "home",
    path: "/home",
    iconText: "H",
    accessID: "PPB001",
    icon: <DescriptionIcon fontSize="small" />,
    role: authRoles.user,
  },
  {
    name: "Print Price Books",
    path: "/pages/view-price-book",
    iconText: "V",
    accessID: "PPB002",
    icon: <DescriptionIcon fontSize="small" />,
    role: authRoles.user,
  },

  {
    name: "Run Price Book",
    path: "/pages/run-price-book",
    iconText: "C",
    accessID: "PPB004",
    icon: <DescriptionIcon fontSize="small" />,
    role: authRoles.user,
  },
  {
    name: "Quote",
    icon: <DescriptionIcon fontSize="small" />,
    path: "/pages/quote-form",
    role: authRoles.user,
    accessID: "PPB005",
    iconText: "V",
  },
  {
    name: "View Directory",
    path: "/pages/view-directory",
    iconText: "V",
    icon: <DescriptionIcon fontSize="small" />,
    accessID: "PPB006",
    role: authRoles.user,
  },
  {
    name: "Add New Contact",
    path: "/pages/add-new-contact",
    accessID: "PPB007",
    iconText: "V",
    icon: <DescriptionIcon fontSize="small" />,
    role: authRoles.user,
  },
  {
    name: "Edit Price Book",
    icon: <DescriptionIcon fontSize="small" />,
    path: "/pages/edit-price-book",
    role: authRoles.user,
    accessID: "PPB008",
    iconText: "E",
  },
  {
    name: "Price Book Template",
    icon: <DescriptionIcon fontSize="small" />,
    path: "/pages/price-book-template",
    role: authRoles.user,
    accessID: "PPB009",
    iconText: "P",
  },
  {
    name: "Quote Template",
    icon: <DescriptionIcon fontSize="small" />,
    path: "/pages/quote-template",
    role: authRoles.user,
    accessID: "PPB0010",
    iconText: "QT",
  },
  {
    name: "Specials",
    icon: <DescriptionIcon fontSize="small" />,
    path: "/pages/specials",
    role: authRoles.user,
    accessID: "PPB0011",
    iconText: "S",
  },
  {
    name: "Configure Price Book",
    icon: <DescriptionIcon fontSize="small" />,
    path: "/pages/price-book/configure",
    role: authRoles.admin,
    accessID: "PPB0012",
    iconText: "C",
  },
];

