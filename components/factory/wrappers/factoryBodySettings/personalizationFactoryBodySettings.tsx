import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FactoryContent from "../factoryContent";
import { PersonalizationFactoryControlSettings } from "../factoryControlSettings/personalizationFactoryControlSettings";
import { useUpdateContentGroup } from "hooks/api/contentGroup";
import { buildComponentPayload, calculateFixedButtonsPaddingRight, convertVariationsMapToSelectedComponents } from "utils/factoryHelpers";
import { ComponentMap, SelectedComponent } from "utils/sharedTypes";

const PersonalizationFactoryBodySettings = ({ content, campaign }) => {
  const campaignTargets = campaign.targets[0]["Targets for FE coding challenge"][0]
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([])
  const [leftPanelSize, setLeftPanelSize] = useState(25);
  const [selectedTarget, setSelectedTarget] = useState(campaignTargets)
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleResize = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
  };
  const { updateContentGroup } = useUpdateContentGroup()

  useEffect(() => {
    const variations = content.results
    const components: ComponentMap = content.components

    if (variations?.[0]?.variations) { // if we have generated content
      setSelectedComponents(convertVariationsMapToSelectedComponents(variations[0].variations))
    } else if (components) {
      const initialSelectedComponents: SelectedComponent[] = Object.entries(components).map(([id, component]) => ({
        id,
        html_tag: component.meta.html_tag,
        selected_element: component.meta.selected_element,
        preceding_element: component.meta.preceding_element,
        succeeding_element: component.meta.succeeding_element,
        text: component.text,
      }))

      setSelectedComponents(initialSelectedComponents);
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const payload = buildComponentPayload(content.contentGroup, selectedComponents);

      const updateContent = async () => {
        try {
          const content = await updateContentGroup(payload)
        } catch (err) {
          console.error("Failed to update content group:", err)
        }
      }

      updateContent()

    }, 800)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    };
  }, [selectedComponents])

   const generateContentCallback = (variationsMap: ComponentMap): void => {
    setSelectedComponents(convertVariationsMapToSelectedComponents(variationsMap))
   }

  const addSelectedComponent = (newComponent: SelectedComponent): void => {
    setSelectedComponents(prevComponents => [...prevComponents, newComponent])
  }

  const removeSelectedComponent = (id: string): void => {
    setSelectedComponents(prevComponents => prevComponents.filter(component => component.id !== id))
  }

  const changeSelectedTarget = (target: string): void => {
    setSelectedTarget(target)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-50px)] bg-white">
      <PanelGroup direction="horizontal" onLayout={handleResize}>
        <Panel defaultSize={25} minSize={20} maxSize={80}>
          <div className="z-10 w-full h-full mb-40 overflow-x-hidden overflow-y-scroll flex flex-col items-start">
            <PersonalizationFactoryControlSettings
              content={content}
              selectedComponents={selectedComponents}
              removeComponent={removeSelectedComponent}
              targets={campaign.targets[0]["Targets for FE coding challenge"]}
              selectedTarget={selectedTarget}
              changeSelectedTarget={changeSelectedTarget}
              generateContentCallback={generateContentCallback}
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
