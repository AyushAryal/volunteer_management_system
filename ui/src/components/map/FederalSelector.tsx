import { useEffect, useState } from 'react';
import { useHookstate } from '@hookstate/core';

import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
    Province,
    District,
    Municipality
} from '@models/federal';
import { storeState } from '@models/store';

import { useMap } from 'react-leaflet/hooks';
import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BoundingBox } from '@models/geojson';
import { LatLngBounds } from 'leaflet';

export function FederalSelector() {
  const [expanded, setExpanded] = useState<boolean>(false);

    const store = useHookstate(storeState);
    const mapControls = store.mapControls;
    const map = useMap();

    useEffect(() => {
        let bbox: BoundingBox = [26, 80, 31, 89];
        if (mapControls.selectedMunicipality.get() !== null) {
            let municipality = store.municipalityList.get().find((body) => body.url == mapControls.selectedMunicipality.get());
            bbox = municipality?.shape.bbox as BoundingBox ?? bbox;
        } else if (mapControls.selectedDistrict.get() !== null) {
            let district = store.districtList.get().find((body) => body.url == mapControls.selectedDistrict.get());
            bbox = district?.shape.bbox as BoundingBox ?? bbox;
        } else if (mapControls.selectedProvince.get() !== null) {
            let province = store.provinceList.get().find((body) => body.url == mapControls.selectedProvince.get());
            bbox = province?.shape.bbox as BoundingBox ?? bbox;
        }
        let bounds = new LatLngBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
        map.flyToBounds(bounds);
    }, [mapControls.selectedProvince, mapControls.selectedDistrict, mapControls.selectedMunicipality]);

  const updateProvince = (province: Province | undefined) => {
    mapControls.selectedMunicipality.set(() => null);
    mapControls.selectedDistrict.set(() => null);
    mapControls.selectedProvince.set(() => province?.url ?? null);
  };

  const updateDistrict = (district: District | undefined) => {
    mapControls.selectedMunicipality.set(() => null);
    mapControls.selectedDistrict.set(() => district?.url ?? null);
    let province = store.provinceList
      .get()
      .find((province) => province.url === district?.province);
    if (province !== undefined) {
      mapControls.selectedProvince.set(() => province?.url ?? null);
    }
  };

  const updateMunicipality = (municipality: Municipality | undefined) => {
    mapControls.selectedMunicipality.set(() => municipality?.url ?? null);
    let district = store.districtList
      .get()
      .find((district) => district.url === municipality?.district);
    if (district !== undefined) {
      mapControls.selectedDistrict.set(() => district?.url ?? null);
      let province = store.provinceList
        .get()
        .find((province) => province.url === district?.province);
      mapControls.selectedProvince.set(() => province?.url ?? null);
    }
  };

  const expanded_icon = (
    <Button
      rounded
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      <FontAwesomeIcon icon="filter"></FontAwesomeIcon>
    </Button>
  );

  if (!expanded) {
    return expanded_icon;
  }

  const progressSpinner = (
    <ProgressSpinner
      className="flex align-self-center"
      style={{ width: "50px", height: "50px" }}
    />
  );

    return (
      <div className="flex flex-column justify-content-center align-content-center border-round">
        <Button className="mb-1" size="small" label="Filter" onClick={() => setExpanded(!expanded)}>
          <FontAwesomeIcon icon="filter"></FontAwesomeIcon>
        </Button>
        <Dropdown
          value={store.provinceList
            .get()
            .find(
              (province) => mapControls.selectedProvince.get() == province.url
            )}
          onChange={(ev) => {
            updateProvince(ev.value);
          }}
          options={store.provinceList.get() as Province[]}
          emptyMessage={
            store.provinceList.get().length == 0 ? progressSpinner : null
          }
          optionLabel="name"
          showClear
          placeholder="Select a province"
          className="w-full md:w-15rem p-inputtext-sm"
        />
        <Dropdown
          value={store.districtList
            .get()
            .find(
              (district) => mapControls.selectedDistrict.get() == district.url
            )}
          onChange={(ev) => {
            updateDistrict(ev.value);
          }}
          options={store.districtList.get() as District[]}
          emptyMessage={
            store.districtList.get().length == 0 ? progressSpinner : null
          }
          optionLabel="name"
          showClear
          filter
          filterInputAutoFocus
          placeholder="Select a district"
          className="w-full md:w-15rem p-inputtext-sm"
        />
        <Dropdown
          value={store.municipalityList
            .get()
            .find(
              (municipality) =>
                mapControls.selectedMunicipality.get() == municipality.url
            )}
          onChange={(ev) => {
            updateMunicipality(ev.value);
          }}
          options={store.municipalityList.get() as Municipality[]}
          emptyMessage={
            store.municipalityList.get().length == 0 ? progressSpinner : null
          }
          optionLabel="name"
          showClear
          filter
          filterInputAutoFocus
          placeholder="Select a municipality"
          className="w-full md:w-15rem p-inputtext-sm"
        />
      </div>
    );
}
