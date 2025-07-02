import AdminLayout from "../layout/layout";
import LineMaster from "../pages/line";
import Orders from "../pages/order";
import OrderScheduler from "../pages/schedule";
import ShiftMaster from "../pages/shift";
import UnitMaster from "../pages/units";

export const MY_ROUTES = [
  {
    name: "Admin",
    layout: AdminLayout,
    path: "portal",
    children: [
      {
        path: "units",
        name: "Unit",
        component: UnitMaster,
      },
      {
        path: "shifts",
        name: "Shifts",
        component: ShiftMaster,
      },
      {
        path: "lines",
        name: "Lines",
        component: LineMaster,
      },
      {
        path: "orders",
        name: "Orders",
        component: Orders,
      },
      {
        path: "scheduler",
        name: "Scheduler",
        component: OrderScheduler,
      },
    ],
  },
];
