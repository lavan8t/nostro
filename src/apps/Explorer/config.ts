import { MenuItem } from "../../state/AppContext";

export const getExplorerMenus = (dispatch: any, winId: string): MenuItem[] => [
  { label: "File", action: () => {} },
  { label: "Edit", action: () => {} },
  { label: "View", action: () => {} },
  { label: "Favorites", action: () => {} },
  { label: "Tools", action: () => {} },
  { label: "Help", action: () => {} },
];
