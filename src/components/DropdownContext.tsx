import { useEffect, useState, use } from "react";
import Select from "react-select";
import "../index.css";
import "../App.css";
import { getMuniciaplityBarangayPair } from "../Query";
import { MyContext } from "../App";

export default function DropdownData() {
  const { updateMunicipals, updateBarangays } = use(MyContext);

  const [initMunicipalBarangay, setInitMunicipalBarangay] = useState([
    {
      municipality: "",
      barangay: [
        {
          name: "",
        },
      ],
    },
  ]);
  const [municipalitySelected, setMunicipalitySelected] = useState(null);

  const [barangaySelected, setBarangaySelected] = useState(null);
  const [barangayList, setBarangayList] = useState([]);

  useEffect(() => {
    getMuniciaplityBarangayPair().then((response: any) => {
      console.log(response);
      setInitMunicipalBarangay(response);
    });
  }, []);

  // handle change event of the Municipality dropdown
  const handleMunicipalityChange = (obj: any) => {
    console.log(obj);
    setMunicipalitySelected(obj);
    setBarangayList(obj.barangay);
    setBarangaySelected(null);
    updateMunicipals(obj.municipality);
    updateBarangays(undefined);
  };

  // handle change event of the barangay dropdownff
  const handleBarangayChange = (obj: any) => {
    setBarangaySelected(obj);
    updateBarangays(obj.name);
  };

  return (
    <>
      <DropdownListDisplay
        handleMunicipalityChange={handleMunicipalityChange}
        handleBarangayChange={handleBarangayChange}
        municipalitySelected={municipalitySelected}
        initMunicipalBarangay={initMunicipalBarangay}
        barangaySelected={barangaySelected}
        barangayList={barangayList}
      ></DropdownListDisplay>
    </>
  );
}

export function DropdownListDisplay({
  handleMunicipalityChange,
  handleBarangayChange,
  municipalitySelected,
  initMunicipalBarangay,
  barangaySelected,
  barangayList,
}: any) {
  // Style CSS
  const customstyles = {
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
          ? "#2b2b2b"
          : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div className="dropdownFilterLayout">
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
        }}
      >
        Municipality
      </div>
      <Select
        placeholder="Select Municipality"
        value={municipalitySelected}
        options={initMunicipalBarangay}
        onChange={handleMunicipalityChange}
        getOptionLabel={(x: any) => x.municipality}
        styles={customstyles}
      />
      <br />
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
          paddingLeft: "10px",
        }}
      >
        Barangay
      </div>
      <Select
        placeholder="Select Barangay"
        value={barangaySelected}
        options={barangayList}
        onChange={handleBarangayChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
