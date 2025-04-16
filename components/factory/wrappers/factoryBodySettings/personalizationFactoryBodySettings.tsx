import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FactoryContent from "../factoryContent";
import { PersonalizationFactoryControlSettings } from "../factoryControlSettings/personalizationFactoryControlSettings";
import { useUpdateContentGroup } from "hooks/api/contentGroup";
import { buildContentGroupPayload, calculateFixedButtonsPaddingRight, convertComponentMapToSelectedComponents, convertVariationsMapToSelectedComponents } from "utils/factoryHelpers";
import { ComponentMap, SelectedComponent } from "utils/sharedTypes";

const PersonalizationFactoryBodySettings = ({ content, campaign }) => {
  const campaignTargets = campaign?.targets?.[0]?.["Targets for FE coding challenge"] || []
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([])
  const [leftPanelSize, setLeftPanelSize] = useState(25);
  const [selectedTarget, setSelectedTarget] = useState(campaignTargets[0] || "")
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const handleResize = (sizes: number[]) => {
    setLeftPanelSize(sizes[0]);
  };
  const { updateContentGroup } = useUpdateContentGroup()

  useEffect(() => {
    const { results, components } = content

    if (results?.[0]?.variations) {
      setSelectedComponents(convertVariationsMapToSelectedComponents(results[0].variations))
    } else if (components) {
      setSelectedComponents(convertComponentMapToSelectedComponents(components))
    }
  }, [])

  const debouncedContentUpdate = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      const payload = buildContentGroupPayload(content.contentGroup, selectedComponents)
  
      const update = async () => {
        try {
          await updateContentGroup(payload)
        } catch (err) {
          console.error("Failed to update content group:", err)
        }
      }
      update()
    }, 800)
  }

  useEffect(() => {
    debouncedContentUpdate()
  
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [selectedComponents])
  
  const addSelectedComponent = (newComponent: SelectedComponent): void => {
    setSelectedComponents(prevComponents => [...prevComponents, newComponent])
  }
  
  const removeSelectedComponent = (id: string): void => {
    setSelectedComponents(prevComponents => prevComponents.filter(component => component.id !== id))
  }
  
  const changeSelectedTarget = (target: string): void => {
    setSelectedTarget(target)
  }
  
  const onContentGenerated = (variationsMap: ComponentMap): void => {
   setSelectedComponents(convertVariationsMapToSelectedComponents(variationsMap))
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
              targets={campaignTargets}
              selectedTarget={selectedTarget}
              changeSelectedTarget={changeSelectedTarget}
              onContentGenerated={onContentGenerated}
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
