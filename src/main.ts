import { View, parse } from "vega";
const spec = {
  $schema: "https://vega.github.io/schema/vega/v5.json",
  width: 400,
  height: 200,
  padding: 5,
  // Use signal to overwrite a dataset with new data on each trigger
  data: [
    {
      name: "table",
      values: [],
      on: [
        {
          trigger: "z",
          remove: "true",
        },
        {
          trigger: "z",
          insert: "[{value: z}]",
        },
      ],
    },
  ],
  signals: [{ name: "z", value: 0.5 }],
  scales: [
    {
      name: "yscale",
      domain: [0, 1],
      nice: true,
      range: "height",
    },
  ],
  axes: [{ orient: "left", scale: "yscale" }],
  marks: [
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        enter: {
          x: { value: 20 },
          width: { value: 20 },
          y: { scale: "yscale", field: "value" },
          y2: { scale: "yscale", value: 0 },
          fill: { value: "steelblue" },
        },
      },
    },
  ],
};
document.getElementById("app")!.innerHTML = `
<h1>Updating Data from Signal Memory Leak</h1>
<p>Use the buttons below to update the Vega chart data from a signal value. Record performance in the Chrome devtools and observe a memory leak where the number of Nodes continues going up</p>
<div>
  <button id="update-signal">Update signal manually</button>
  <button id="start-auto">Start updating signal on timer</button>
  <button id="stop-auto">Stop updating signal on timer</button>
  <div id="vega-container"></div>
</div>`;

const vegaContainer = document.getElementById("vega-container")!;
const view = new View(parse(spec)).initialize(vegaContainer).renderer("svg");
view.run();

let zValue = Math.random();
const updateZ = () => {
  zValue = Math.random();
  view.signal("z", zValue);
  view.run();
};

const updateSignalBtn = document.getElementById("update-signal");
updateSignalBtn!.addEventListener("click", () => {
  updateZ();
});

const startAuto = document.getElementById("start-auto")!;
const stopAuto = document.getElementById("stop-auto")!;

let timerId: number | undefined;
startAuto.addEventListener("click", () => {
  clearInterval(timerId);
  timerId = setInterval(() => {
    updateZ();
  }, 100);
});

stopAuto?.addEventListener("click", () => {
  clearInterval(timerId);
});
