import { FarmSectionType, PlotGridType } from "@/types/farm";

const colors = {
  green: ["#7CBDB0", "#56A898", "#2F9480", "#267666", "#1C594D", "#133B33"],
  plotGreen: [
    "#A3D1C8",
    "#5AC5B0",
    "#267666",
    "#7CBDB0",
    "#0E2C26",
    "#56A898",
    "#1C594D",
    "#309480",
    "#C9E6E0",
  ],
};

const pickRandomColor = (colorSet: string[]) => {
  return colorSet[Math.floor(Math.random() * colors.green.length)];
};

export const PLOTS_GRIDS_DATA: PlotGridType[] = [
  { id: "A1", name: "A1", color: "#A3D1C8" },
  { id: "A2", name: "A2", color: "#5AC5B0", missingPicture: true },
  { id: "A3", name: "A3", color: "#267666" },
  { id: "A4", name: "A4", color: "#7CBDB0" },
  { id: "A5", name: "A5", color: "#A3D1C8" },
  { id: "A6", name: "A6", color: "#56A898" },
  { id: "A7", name: "A7", color: "#267666" },
  { id: "A8", name: "A8", color: "#0E2C26" },
  { id: "A9", name: "A9", color: "#A3D1C8" },
  { id: "A10", name: "A10", color: "#1C594D" },
  { id: "A11", name: "A11", color: "#0E2C26" },
  { id: "A12", name: "A12", color: "#56A898" },
  { id: "A13", name: "A13", color: "#309480", missingPicture: true },
  { id: "A14", name: "A14", color: "#267666" },
  { id: "A15", name: "A15", color: "#C9E6E0" },
  { id: "A16", name: "A16", color: "#309480" },
  { id: "A17", name: "A17", color: "#7CBDB0" },
  { id: "A18", name: "A18", color: "#267666" },
  { id: "A19", name: "A19", color: "#1C594D" },
  { id: "A20", name: "A20", color: "#309480" },
];

function getRandomMissingNumbers(maxNumber: number, numberOfMissing: number) {
  const result = [];
  for (let i = 0; i < numberOfMissing; i++) {
    const randomInt = Math.floor(Math.random() * (maxNumber + 1)); // from 0 to maxNumber inclusive
    result.push(randomInt);
  }

  return result;
}

const generatePlotGridsData = (
  numberOfGrids: number,
  missingPicture: number
) => {
  const missingNumbers = getRandomMissingNumbers(numberOfGrids, missingPicture);
  return Array.from({ length: numberOfGrids }, (_, index) => ({
    id: `A${index + 1}`,
    name: `A${index + 1}`,
    color: pickRandomColor(colors.plotGreen),
    missingPicture: missingNumbers.includes(index),
  }));
};

export const SECTIONS_DATA: FarmSectionType[] = [
  {
    id: "A1",
    coords: [
      { lat: 25.089065319049798, lng: 55.930347831312496 },
      { lat: 25.088640418393148, lng: 55.930917532705394 },
      { lat: 25.08833312324895, lng: 55.930607548123966 },
      { lat: 25.08876181873129, lng: 55.930042035711885 },
      { lat: 25.089065319049798, lng: 55.930347831312496 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A1",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A2",
    coords: [
      { lat: 25.088640418393148, lng: 55.930917532705394 },
      { lat: 25.088283804203346, lng: 55.93139088753921 },
      { lat: 25.087942364111655, lng: 55.93108090295778 },
      { lat: 25.088330194372247, lng: 55.9306043683831 },
      { lat: 25.088640418393148, lng: 55.930917532705394 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A2",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A3",
    coords: [
      { lat: 25.088451201993006, lng: 55.93173637095541 },
      { lat: 25.088064649451756, lng: 55.93225783443543 },
      { lat: 25.087817734105442, lng: 55.93205145572535 },
      { lat: 25.088229384167686, lng: 55.93153199085539 },
      { lat: 25.088451201993006, lng: 55.93173637095541 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A3",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A4",
    coords: [
      { lat: 25.08945967201043, lng: 55.93073855110712 },
      { lat: 25.088966766554694, lng: 55.9313636256704 },
      { lat: 25.088585935689945, lng: 55.93101257369345 },
      { lat: 25.08907312451242, lng: 55.93035087860019 },
      { lat: 25.08945967201043, lng: 55.93073855110712 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A4",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A5",
    coords: [
      { lat: 25.088966766554694, lng: 55.9313636256704 },
      { lat: 25.08866827759145, lng: 55.93174877261856 },
      { lat: 25.088288589438577, lng: 55.931391406757136 },
      { lat: 25.088585935689945, lng: 55.93101257369345 },
      { lat: 25.088966766554694, lng: 55.9313636256704 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A5",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A6",
    coords: [
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.08925156799906, lng: 55.93232991108206 },
      { lat: 25.088670247235253, lng: 55.93174705898475 },
      { lat: 25.089139946727414, lng: 55.93114469609118 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A6",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A7",
    coords: [
      { lat: 25.090019355160727, lng: 55.93125842020592 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.089139946727414, lng: 55.93114469609118 },
      { lat: 25.08945967201043, lng: 55.93073855110712 },
      { lat: 25.090019355160727, lng: 55.93125842020592 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A7",
    isMissingPicture: true,
    grids: generatePlotGridsData(20, 4),
  },

  {
    id: "A8",
    coords: [
      { lat: 25.090643948218073, lng: 55.93186174473077 },
      { lat: 25.090315728700336, lng: 55.932291646878866 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.090019355160727, lng: 55.93125842020592 },
      { lat: 25.090643948218073, lng: 55.93186174473077 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A8",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A9",
    coords: [
      { lat: 25.090315728700336, lng: 55.932291646878866 },
      { lat: 25.089679074619703, lng: 55.93302474487086 },
      { lat: 25.089121096516124, lng: 55.932556101540804 },
      { lat: 25.089641334560458, lng: 55.9317033186708 },
      { lat: 25.090315728700336, lng: 55.932291646878866 },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "A9",
    grids: generatePlotGridsData(20, 0),
  },
];
