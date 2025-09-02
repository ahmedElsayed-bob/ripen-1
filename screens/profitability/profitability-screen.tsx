"use client";

import { useEffect, useMemo, useState } from "react";
import { PlotPageHeader } from "../plot/plot-page-header";
import { getFarmById } from "@/lib/storage";
import { FarmType } from "@/types/farm";
import { Slider } from "@/components/ui/slider";
import { ReadinessOverlay } from "@/components/readiness-overlay";
import { FarmPlotsMap } from "../field/map/farm-plots-map";

export function ProfitabilityScreen({
  id,
  plot,
}: {
  id: string;
  plot: String;
}) {
  const [farm, setFarm] = useState<FarmType>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const farm = getFarmById(id);
    setFarm(farm);
    setIsLoading(false);
  }, [id, plot]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        LOADING....
      </div>
    );

  if (!farm) return <>No farm found</>;

  return (
    <>
      <PlotPageHeader
        farmName={farm.name}
        id={id}
        title="Yield & Revenues"
        subtitle="Forecast your revenues and simulate different scenarios"
        breadcrumbSuffix={[{ label: "Revenues" }]}
      />

      <YieldParameters farm={farm} />
    </>
  );
}

const newColors: Record<string, string[]> = {
  "#133B33": ["#1C594D", "#267666", "#2F9480", "#56A898", "#7CBDB0"],
  "#1C594D": ["#267666", "#2F9480", "#56A898", "#7CBDB0", "#7f8000"],
  "#267666": ["#2F9480", "#56A898", "#7CBDB0", "#7f8000", "#b2b300"],
  "#2F9480": ["#56A898", "#7CBDB0", "#7f8000", "#b2b300", "#c6c600"],
  "#56A898": ["#7CBDB0", "#7f8000", "#b2b300", "#c6c600", "#ffff1a"],
  "#7CBDB0": ["#7f8000", "#b2b300", "#c6c600", "#ffff1a", "#ffff4d"],
};

function calculatePriceDecrease(sliderValue: number): number {
  const decreaseValues = [2.4, 2.4, 2.4, 2.4, 2.4, 1.7, 1.3, 1.3, 1.3, 1.3];

  return decreaseValues[Math.abs(sliderValue - 1)];
}

function YieldParameters({ farm }: { farm: FarmType }) {
  const [values, setValues] = useState({
    expectedYield: 1240,
    marketPrice: 248.46,
    grades: {
      A: 52,
      B: 27,
      C: 21,
    },
  });
  console.log({ values });
  const revenue = values.expectedYield * values.marketPrice;

  const [timeToHarvest, setTimeToHarvest] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);

  const handleTimeToHarvestChange = (value: number) => {
    setTimeToHarvest(value);

    const gradeAChange = 52 - Math.abs(value) * 5;
    const gradeBChange = 27 - Math.abs(value) * 5;
    const gradeCChange =
      100 -
      (gradeAChange > 0 ? gradeAChange : 0) -
      (gradeBChange > 0 ? gradeBChange : 0);

    const newYield = 1240 - Math.abs(value) * 12;
    const newMarketPrice =
      values.marketPrice - (calculatePriceDecrease(value) || 0);

    setValues({
      ...values,
      expectedYield: newYield,
      marketPrice: Math.floor(newMarketPrice),
      grades: {
        A: gradeAChange,
        B: gradeBChange,
        C: gradeCChange,
      },
    });
  };

  const onMarketPriceChange = (value: number) => {
    setMarketPrice(value);
    const priceChange2PercentOfCurrent = (values.marketPrice * 2) / 100;

    const newMarketPrice = values.marketPrice + priceChange2PercentOfCurrent;

    setValues({
      ...values,
      marketPrice: Math.floor(newMarketPrice),
    });
  };

  const getColors = () => {
    let colors: Record<string, string> = {};
    Object.keys(newColors).forEach((c) => {
      const values = newColors[c];
      const index = Math.abs(timeToHarvest);
      const correctIndex =
        index <= 1
          ? 0
          : index <= 3
          ? 1
          : index <= 5
          ? 2
          : index <= 7
          ? 3
          : index <= 9
          ? 4
          : 4;
      colors[c] = values[correctIndex];
    });

    return colors;
  };

  const updatedColors = useMemo(() => {
    if (timeToHarvest === 0) return;

    return getColors();
  }, [timeToHarvest]);

  return (
    <div className="container mx-auto">
      <div className="flex gap-4 ">
        <div className=" flex-1 bg-gray-100 relative">
          <FarmPlotsMap farm={farm} colors={updatedColors} />

          <div className="absolute bottom-4 left-4 bg-gray-100">
            <ReadinessOverlay title="Expected Revenue" />
          </div>
        </div>

        <div className="w-[400px]">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <YieldCard
              title="Expected Yield"
              value={`${values.expectedYield} t`}
            />

            <CardContainer>
              <p className="font-medium mb-2">Grade Breakdown</p>

              <div>
                <div className=" flex items-center">
                  <div style={{ width: `${values.grades.A}%` }}>
                    <div className="bg-[#319480] text-white p-1 text-center">
                      A
                    </div>
                    <div className="text-xs text-gray-500 ms-1">
                      {values.grades.A}%
                    </div>
                  </div>
                  {values.grades.B > 0 && (
                    <div style={{ width: `${values.grades.B}%` }}>
                      <div className="bg-[#f7947B] p-1 text-center">B</div>
                      <div className="text-xs text-gray-500 ms-1">
                        {values.grades.B}%
                      </div>
                    </div>
                  )}
                  {values.grades.C > 0 && (
                    <div style={{ width: `${values.grades.C}%` }}>
                      <div className="bg-[#ECF493] p-1 text-center">C</div>
                      <div className="text-xs text-gray-500 ms-1">
                        {values.grades.C}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContainer>

            <YieldCard title="Revenue" value={`${revenue} USD`} />

            <YieldCard
              title="Market Price"
              value={`${values.marketPrice} USD/ton`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CardContainer>
              <p className="font-medium mb-2">Time To Harvest</p>
              <div className="space-y-2">
                <Slider
                  value={[timeToHarvest]}
                  max={10}
                  min={-10}
                  step={1}
                  className="w-full rounded-full"
                  style={{ height: "6px", background: "#12A789" }}
                  onValueChange={(value) => handleTimeToHarvestChange(value[0])}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>-10 days</span>
                  <span>+10 days</span>
                </div>
              </div>
            </CardContainer>

            <CardContainer>
              <p className="font-medium mb-2">Market Price</p>
              <div className="space-y-2">
                <Slider
                  value={[marketPrice]}
                  max={10}
                  min={-10}
                  step={1}
                  className="w-full rounded-full"
                  style={{ height: "6px", background: "#12A789" }}
                  onValueChange={(value) => onMarketPriceChange(value[0])}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>-10 USD/ton</span>
                  <span>+10 USD/ton</span>
                </div>
              </div>
            </CardContainer>

            <CardContainer>
              <p className="font-medium mb-2">Yield per Ha</p>
              <div className="space-y-2">
                <Slider
                  defaultValue={[0]}
                  max={10}
                  min={-10}
                  step={1}
                  className="w-full rounded-full"
                  style={{ height: "6px", background: "#12A789" }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>-10</span>
                  <span>+10</span>
                </div>
              </div>
            </CardContainer>

            <CardContainer>
              <p className="font-medium mb-2">Grade A</p>
              <div className="space-y-2">
                <Slider
                  defaultValue={[0]}
                  max={10}
                  min={-10}
                  step={1}
                  className="w-full rounded-full"
                  style={{ height: "6px", background: "#12A789" }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>-10</span>
                  <span>+10</span>
                </div>
              </div>
            </CardContainer>

            <CardContainer>
              <p className="font-medium mb-2">Grade B</p>
              <div className="space-y-2">
                <Slider
                  defaultValue={[0]}
                  max={10}
                  min={-10}
                  step={1}
                  className="w-full rounded-full"
                  style={{ height: "6px", background: "#12A789" }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>-10</span>
                  <span>+10</span>
                </div>
              </div>
            </CardContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 shadow-lg p-4 rounded-lg">
      {children}
    </div>
  );
}

function YieldCard({ title, value }: { title: string; value: string }) {
  return (
    <CardContainer>
      <p className="font-medium mb-2">{title}</p>
      <p className="text-gray-500">{value}</p>
    </CardContainer>
  );
}
