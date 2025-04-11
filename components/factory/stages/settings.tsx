import { useMemo } from "react";
import Accordion from "../../../components/core/accordion";
import {
  TrashIcon
} from '@heroicons/react/20/solid';
import TargetListBox from "components/core/TargetListBox";

const Settings = ({ 
  selectedComponents, 
  removeComponent, 
  targets,
  selectedTarget,
  changeSelectedTarget,
}) => {
  const windowWidth = useMemo(() => window?.innerWidth, [window?.innerWidth]);

  const accordionLabel = (number, text, stage) => {
    let preText = <span className="pl-1 pr-2">{number}.</span>;

    if (windowWidth < 1290 && stage === "instructions") {
      return (
        <div className="flex text-left">
          <span>{preText}</span>
          <div className="grid justify-items-start">
            <span>Add Instructions</span>
            <span>(optional)</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex text-left">
        <span>{preText}</span>
        <span>{text}</span>
      </div>
    );
  };

  const componentContent = selectedComponents.length 
  ? selectedComponents.map(component => {
    return <div key={component.id} className="flex items-center justify-between text-sm font-normal text-slate-700 border p-3 rounded-lg shadow-md mb-1">
    <p className="flex-1">{component.text}</p>
    <button
      onClick={() => removeComponent(component.id)}
    >
      <TrashIcon className="h-6 w-6" />
    </button>
  </div>
  })
  : <p className="text-sm font-normal text-slate-700">
      On the canvas, select components that you want Tofu to
      personalize. We’ll generate multiple options for each component.
    </p>

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div>
          <Accordion
            key="1"
            label={accordionLabel(1, "Select components", "components")}
            customizeClassName={{
              border: "border-none",
              paddingX: "px-0",
              paddingY: "py-1",
            }}
            testId="components-accordion"
            iconPosition="right"
            initOpen={true}
          >
            <div className="flex flex-col gap-y-1 mt-6">
              {componentContent}
            </div>
          </Accordion>
        </div>
        <div>
          <Accordion
            key="2"
            label={accordionLabel(2, "Test it out!", null)}
            customizeClassName={{
              border: "border-none",
              paddingX: "px-0",
              paddingY: "py-1",
              paddingB: "pb-1",
            }}
            iconPosition="right"
            initOpen={false}
          >
            <div className="flex flex-col gap-y-1 mt-6 text-fontcolor-default">
              <h3 className="font-medium mb-3">
                Great job! 🎉 Now, let’s work together on your first target.
              </h3>
              <p className="text-sm font-normal pb-2">
                Once we get it right, Tofu will apply those learnings to your
                other targets.
              </p>
            </div>
            <TargetListBox 
              selectedTarget={selectedTarget} 
              allTargets={targets} 
              onChange={changeSelectedTarget}
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Settings;
