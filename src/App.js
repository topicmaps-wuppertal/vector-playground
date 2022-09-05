import { useEffect } from "react";

import "./App.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-cismap/topicMaps.css";
import { md5FetchText, fetchJSON } from "react-cismap/tools/fetching";
import { getGazDataForTopicIds } from "react-cismap/tools/gazetteerHelper";

import TopicMapContextProvider from "react-cismap/contexts/TopicMapContextProvider";
import { getClusterIconCreatorFunction } from "react-cismap/tools/uiHelper";
import TopicMapComponent from "react-cismap/topicmaps/TopicMapComponent";
import FeatureCollection from "react-cismap/FeatureCollection";
import GenericInfoBoxFromFeature from "react-cismap/topicmaps/GenericInfoBoxFromFeature";
import getGTMFeatureStyler from "react-cismap/topicmaps/generic/GTMStyler";
import { MappingConstants } from "react-cismap";
const host = "https://wupp-topicmaps-data.cismet.de";

const getGazData = async (setGazData) => {
  const prefix = "GazDataForStories";
  const sources = {};

  sources.adressen = await md5FetchText(prefix, host + "/data/adressen.json");
  sources.bezirke = await md5FetchText(prefix, host + "/data/bezirke.json");
  sources.quartiere = await md5FetchText(prefix, host + "/data/quartiere.json");
  sources.pois = await md5FetchText(prefix, host + "/data/pois.json");
  sources.kitas = await md5FetchText(prefix, host + "/data/kitas.json");

  const gazData = getGazDataForTopicIds(sources, [
    "pois",
    "kitas",
    "bezirke",
    "quartiere",
    "adressen",
  ]);

  setGazData(gazData);
};

function App() {
  const [gazData, setGazData] = useState([]);
  useEffect(() => {
    getGazData(setGazData);
  }, []);
  const backgroundConfigurations = {
    stadtplan: {
      layerkey: "wupp-plan-live@90",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    lbk: {
      layerkey: "trueOrtho2020@75|OMT_Klokantech_basic@50",
      src: "/images/rain-hazard-map-bg/ortho.png",
      title: "Luftbildkarte",
    },
    vector1: {
      layerkey: "OMT_Klokantech_basic@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
    vector2: {
      layerkey: "OMT_OSM_bright@100",
      src: "/images/rain-hazard-map-bg/citymap.png",
      title: "Stadtplan",
    },
  };
  const backgroundModes = [
    {
      title: "Vektorbasierter Layer (Klokantech Basic)",
      mode: "default",
      layerKey: "vector1",
    },
    {
      title: "Vektorbasierter Layer (OSM bright)",
      mode: "default",
      layerKey: "vector2",
    },
    {
      title: "Stadtplan (RVR, zum Vergleich)",
      mode: "default",
      layerKey: "stadtplan",
    },
    { title: "Luftbildkarte", mode: "default", layerKey: "lbk" },
  ];
  return (
    <TopicMapContextProvider
      appKey='VectorPlaygroundWuppertal.TopicMap'
      backgroundConfigurations={backgroundConfigurations}
      backgroundModes={backgroundModes}
      referenceSystem={MappingConstants.crs3857}
      referenceSystemDefinition={MappingConstants.proj4crs3857def}
    >
      <TopicMapComponent maxZoom={22} gazData={gazData} locatorControl={true}></TopicMapComponent>
    </TopicMapContextProvider>
  );
}

export default App;
