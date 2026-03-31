import { createContext } from "react";

type MyDropdownContextType = {
  municipals: any;
  barangays: any;
  statusdatefield: any;
  datefields: any;
  timesliderstate: any;
  asofdate: any;
  latestasofdate: any;
  handedoverDatefield: any;
  handedoverAreafield: any;
  newAffectedAreafield: any;
  chartPanelwidth: any;
  newHandedOverfield: any;
  updateMunicipals: any;
  updateBarangays: any;
  updateStatusdatefield: any;
  updateDatefields: any;
  updateTimesliderstate: any;
  updateAsofdate: any;
  updateLatestasofdate: any;
  updateHandedoverDatefield: any;
  updateHandedoverAreafield: any;
  updateNewAffectedAreafield: any;
  updateChartPanelwidth: any;
  updateNewHandedOverfield: any;
};

const initialState = {
  municipals: undefined,
  barangays: undefined,
  statusdatefield: undefined,
  datefields: undefined,
  timesliderstate: undefined,
  asofdate: undefined,
  latestasofdate: undefined,
  handedoverDatefield: undefined,
  handedoverAreafield: undefined,
  newAffectedAreafield: undefined,
  chartPanelwidth: undefined,
  newHandedOverfield: undefined,
  updateMunicipals: undefined,
  updateBarangays: undefined,
  updateStatusdatefield: undefined,
  updateDatefields: undefined,
  updateTimesliderstate: undefined,
  updateAsofdate: undefined,
  updateLatestasofdate: undefined,
  updateHandedoverDatefield: undefined,
  updateHandedoverAreafield: undefined,
  updateNewAffectedAreafield: undefined,
  updateChartPanelwidth: undefined,
  updateNewHandedOverfield: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
