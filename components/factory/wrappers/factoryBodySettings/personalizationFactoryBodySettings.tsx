import { useEffect, useState, useRef } from "react";
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

export type SelectedComponent = {
  id: string
  html_tag: string
  selected_element: string
  preceding_element: string
  succeeding_element: string
  text: string
}

const PersonalizationFactoryBodySettings = ({ content, campaign }) => {
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([])
  const [leftPanelSize, setLeftPanelSize] = useState(25);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleResize = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
  };
  const { updateContentGroup, isLoading, isSuccess, error } = useUpdateContentGroup()

  const buildComponentPayload = (components: SelectedComponent[]) => {
    const componentEntries = components.reduce((acc, component) => {
      acc[component.id] = {
        meta: {
          type: "text",
          html_tag: component.html_tag,
          time_added: Date.now(),
          html_tag_index: null,
          selected_element: component.selected_element,
          preceding_element: component.preceding_element,
          succeeding_element: component.succeeding_element,
        },
        text: component.text,
      }
      return acc
    }, {})
  
    return {
      id: content.contentGroup,
      payload: {
        components: componentEntries,
      },
    }
  }

  useEffect(() => {
    // Clear previous timeout if state changes before timer ends
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const payload = buildComponentPayload(selectedComponents);

      const updateContent = async () => {
        try {
          const content = await updateContentGroup(payload)
          console.log("Update successful:", content)
        } catch (error) {
          console.error("Failed to update content group:", error)
        }
      }
      
      updateContent()

    }, 2000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    };
  }, [selectedComponents])

  const addSelectedComponent = (newComponent: SelectedComponent): void => {
    setSelectedComponents(prevComponents => [...prevComponents, newComponent])
  }

  const removeSelectedComponent = (id: string): void => {
    setSelectedComponents(prevComponents => prevComponents.filter(component => component.id !== id))
  }

  console.log("content", content)
  // console.log("campaign", campaign)
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
            <FactoryContent  
              selectedComponents={selectedComponents} 
              addComponent={addSelectedComponent} 
              removeComponent={removeSelectedComponent} 
            />
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
