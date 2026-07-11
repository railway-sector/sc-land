import { createContext } from "react";

type MyDropdownContextType = {
  asofdate: any;
  updateAsofdate: any;
  timesliderOn: any;
  updateTimesliderOn: any;
  newStatusField: any;
  updateNewStatusField: any;
  newHoaField: any;
  updateNewHoaField: any;
  newAfaField: any;
  updateNewAfaField: any;
  newHoField: any;
  updateNewHoField: any;
  latestDate: any;
  updateLatestDate: any;
};

const initialState = {
  asofdate: undefined,
  updateAsofdate: undefined,
  timesliderOn: undefined,
  updateTimesliderOn: undefined,
  newStatusField: undefined,
  updateNewStatusField: undefined,
  newHoaField: undefined,
  updateNewHoaField: undefined,
  newAfaField: undefined,
  updateNewAfaField: undefined,
  newHoField: undefined,
  updateNewHoField: undefined,
  latestDate: undefined,
  updateLatestDate: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
