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
  plotYellow: ["#F7947B", "#F7947B", "#F7947B", "#F7947B", "#F7947B"],
};

const pickRandomColor = (colorSet: string[]) => {
  return colorSet[Math.floor(Math.random() * colorSet.length)];
};

// const getRandomNumberBetween80And95 = () => {
//   return
// }

export const PLOTS_GRIDS_DATA: PlotGridType[] = [
  { id: "B1", name: "B1", color: "#A3D1C8" },
  { id: "B2", name: "B2", color: "#5AC5B0", missingPicture: true },
  { id: "B3", name: "B3", color: "#267666" },
  { id: "B4", name: "B4", color: "#7CBDB0" },
  { id: "B5", name: "B5", color: "#A3D1C8" },
  { id: "B6", name: "B6", color: "#56A898" },
  { id: "B7", name: "B7", color: "#267666" },
  { id: "B8", name: "B8", color: "#0E2C26" },
  { id: "B9", name: "B9", color: "#A3D1C8" },
  { id: "B10", name: "B10", color: "#1C594D" },
  { id: "B11", name: "B11", color: "#0E2C26" },
  { id: "B12", name: "B12", color: "#56A898" },
  { id: "B13", name: "B13", color: "#309480", missingPicture: true },
  { id: "B14", name: "B14", color: "#267666" },
  { id: "B15", name: "B15", color: "#C9E6E0" },
  { id: "B16", name: "B16", color: "#309480" },
  { id: "B17", name: "B17", color: "#7CBDB0" },
  { id: "B18", name: "B18", color: "#267666" },
  { id: "B19", name: "B19", color: "#1C594D" },
  { id: "B20", name: "B20", color: "#309480" },
];

const generatePlotGridsData = (
  numberOfGrids: number,
  missingPicture: number
) => {
  const missingNumbers = missingPicture > 0 ? [4, 7, 13, 16] : [];
  const alerts: Record<number, string[]> = {
    9: ["Crop stress detected"],
  };

  return Array.from({ length: numberOfGrids }, (_, index) => ({
    id: `B${index + 1}`,
    name: `B${index + 1}`,
    color: pickRandomColor(colors.plotGreen),
    missingPicture: missingNumbers.includes(index + 1),
    alerts: alerts[index + 1] || [],
    // readiness: Match
  }));
};

export const SECTIONS_DATA: FarmSectionType[] = [
  {
    id: "A1",
    coords: [
      {
        lat: 25.09063465874476,
        lng: 55.93184997282035,
      },
      {
        lat: 25.09031765938224,
        lng: 55.93154017767913,
      },
      {
        lat: 25.09000551744504,
        lng: 55.93126256904609,
      },
      {
        lat: 25.089704305793553,
        lng: 55.93168904027946,
      },
      {
        lat: 25.090306728355067,
        lng: 55.93227107963569,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "1",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A2",
    coords: [
      {
        lat: 25.0894998131875,
        lng: 55.93078285016679,
      },
      {
        lat: 25.089196171151976,
        lng: 55.931212003609176,
      },
      {
        lat: 25.089696572824217,
        lng: 55.9316840723958,
      },
      {
        lat: 25.090002642741375,
        lng: 55.931254918953414,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "2",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A3",
    coords: [
      {
        lat: 25.08959212021696,
        lng: 55.93167066135072,
      },
      {
        lat: 25.089169450616776,
        lng: 55.932236607452865,
      },
      {
        lat: 25.08869819658274,
        lng: 55.93177794971132,
      },
      {
        lat: 25.08912329695138,
        lng: 55.93121468581819,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "3",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A4",
    coords: [
      {
        lat: 25.090259788879948,
        lng: 55.93227602455521,
      },
      {
        lat: 25.089682871951183,
        lng: 55.93173287722969,
      },
      {
        lat: 25.089417500984464,
        lng: 55.93212378672254,
      },
      {
        lat: 25.089971342489335,
        lng: 55.93265486410749,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "4",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A5",
    coords: [
      {
        lat: 25.089682612905563,
        lng: 55.93303926900061,
      },
      {
        lat: 25.089951031436605,
        lng: 55.932674488574584,
      },
      {
        lat: 25.089677754646203,
        lng: 55.932416996509154,
      },
      {
        lat: 25.08948949694669,
        lng: 55.9326959462467,
      },
      {
        lat: 25.089500428046836,
        lng: 55.932872972041686,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "5",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A6",
    coords: [
      {
        lat: 25.089300787659297,
        lng: 55.932726791650374,
      },
      {
        lat: 25.08945139407435,
        lng: 55.932710698396285,
      },
      {
        lat: 25.089646939223744,
        lng: 55.93239822104605,
      },
      {
        lat: 25.08939673854194,
        lng: 55.93214475229414,
      },
      {
        lat: 25.08938094916134,
        lng: 55.932174256593306,
      },
      {
        lat: 25.08932993730248,
        lng: 55.93212597683104,
      },
      {
        lat: 25.089282569128812,
        lng: 55.932174256593306,
      },
      {
        lat: 25.089332366439102,
        lng: 55.93223192408713,
      },
      {
        lat: 25.089204836701445,
        lng: 55.932390174419005,
      },
      {
        lat: 25.089227913520965,
        lng: 55.932411632091124,
      },
      {
        lat: 25.089123460513694,
        lng: 55.9325511069599,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "6",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A7",
    coords: [
      {
        lat: 25.088961111784975,
        lng: 55.931365512073754,
      },
      {
        lat: 25.088607670827837,
        lng: 55.93103291815591,
      },
      {
        lat: 25.088329532724615,
        lng: 55.9313923341639,
      },
      {
        lat: 25.088681759910276,
        lng: 55.93173565691781,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "7",
    isMissingPicture: true,
    grids: generatePlotGridsData(20, 4),
  },

  {
    id: "A8",
    coords: [
      {
        lat: 25.08896820858259,
        lng: 55.931354783237694,
      },
      {
        lat: 25.088609909344182,
        lng: 55.93103023594689,
      },
      {
        lat: 25.089099314320265,
        lng: 55.930390799294265,
      },
      {
        lat: 25.089445466454617,
        lng: 55.93073009873465,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "8",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A9",
    coords: [
      {
        lat: 25.08814771181622,
        lng: 55.9316750015484,
      },
      {
        lat: 25.08836269229709,
        lng: 55.931870802806486,
      },
      {
        lat: 25.08807726615278,
        lng: 55.932244970964064,
      },
      {
        lat: 25.087859856004712,
        lng: 55.9320357586609,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "9",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A10",
    coords: [
      {
        lat: 25.08829360449318,
        lng: 55.93136687339901,
      },
      {
        lat: 25.087976599066206,
        lng: 55.93108658255695,
      },
      {
        lat: 25.0883166814845,
        lng: 55.93066011132358,
      },
      {
        lat: 25.08862032570229,
        lng: 55.930943084374654,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "10",
    grids: generatePlotGridsData(20, 0),
  },

  {
    id: "A11",
    coords: [
      {
        lat: 25.088625437203042,
        lng: 55.93093093774715,
      },
      {
        lat: 25.088325436732887,
        lng: 55.930643941382556,
      },
      {
        lat: 25.088765113284357,
        lng: 55.93006458423534,
      },
      {
        lat: 25.089063898105696,
        lng: 55.93035828612247,
      },
    ],
    color: pickRandomColor(colors.green),
    areaM2: 7175,
    name: "11",
    grids: generatePlotGridsData(20, 0),
  },
];
