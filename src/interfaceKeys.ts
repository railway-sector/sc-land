//--- Dropdown
export interface SelectedLocation {
  municipality: string | any;
  barangay: string | any;
}

export const locationKeys = {
  selected: ["selectedLocation"] as const,
};

//-- date fields
export interface DateFieldsType {
  dateFields: any;
  latestdate?: any;
}

export const datefieldKeys = {
  selected: ["selectedDateFields"] as const,
};

//--- Chart
export interface ChartResponse {
  chartData: any[];
  totalNumber: number | string | undefined;
}
