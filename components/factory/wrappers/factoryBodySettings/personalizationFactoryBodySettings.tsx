import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FactoryContent from "../factoryContent";
import { PersonalizationFactoryControlSettings } from "../factoryControlSettings/personalizationFactoryControlSettings";
import { calculateFixedButtonsPaddingRight } from "utils/factoryHelpers";
import { useUpdateContentGroup } from "hooks/api/contentGroup";

const test1 = {
  components: {
    "7JJPz8_F9wo1sgZd" : {
      meta: {
        type: 'text',
        "html_tag": "<div>",
        "time_added": 1730664936853,
        "html_tag_index": null,
        selected_element:
          '<div class="subtext tofu-element tofu-editable-element" data-tofu-id="7JJPz8_F9wo1sgZd">Scale your content efforts, personalize your GTM campaigns,and increase conversion</div>',
        preceding_element: '<a>See a Demo</a>',
        succeeding_element:
          '<div>Scale your content efforts, personalize your GTM campaigns, and increase conversion</div>',
      },
      text: 'Scale your content efforts, personalize your GTM campaigns, and increase conversion',
    }
  },
}

const test2 = {components: {}}

const PersonalizationFactoryBodySettings = ({ content, campaign }) => {
  const [leftPanelSize, setLeftPanelSize] = useState(25);
  const handleResize = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
  };
  const { updateContentGroup, isLoading, isSuccess, error } = useUpdateContentGroup()

  useEffect(() => {
    const testMutate = async () => {
      console.log("update content group")
      const content = await updateContentGroup({id: 304736, payload: test2})
      console.log("done", content)
    }
    // testMutate()
  },[])

  console.log("content", content)
  console.log("campaign", campaign)
  return (
    <div className="flex flex-col h-[calc(100vh-50px)] bg-white">
      <PanelGroup direction="horizontal" onLayout={handleResize}>
        <Panel defaultSize={25} minSize={20} maxSize={80}>
          <div className="z-10 w-full h-full mb-40 overflow-x-hidden overflow-y-scroll flex flex-col items-start">
            <PersonalizationFactoryControlSettings
              currentPaneWidth={leftPanelSize}
              fixedButtonsPaddingRight={calculateFixedButtonsPaddingRight(
                leftPanelSize
              )}
            />
          </div>
        </Panel>
        <PanelResizeHandle className="w-[2px] bg-gray-200 hover:bg-primary transition-colors focus:bg-primary" />
        <Panel>
          <div className="w-full h-full relative overflow-y-scroll">
            <FactoryContent />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

type FactoryBodySettingsWrapperProps = {
  content: any;
  campaign: any;
};

const FactoryBodySettingsWrapper = ({
  content,
  campaign,
}: FactoryBodySettingsWrapperProps) => {
  return (
    <PersonalizationFactoryBodySettings content={content} campaign={campaign} />
  );
};

export default FactoryBodySettingsWrapper;
