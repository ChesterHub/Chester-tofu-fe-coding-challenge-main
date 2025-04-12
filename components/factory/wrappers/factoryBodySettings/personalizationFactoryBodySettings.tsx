import { useEffect, useState, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FactoryContent from "../factoryContent";
import { PersonalizationFactoryControlSettings } from "../factoryControlSettings/personalizationFactoryControlSettings";
import { calculateFixedButtonsPaddingRight } from "utils/factoryHelpers";
import { useUpdateContentGroup } from "hooks/api/contentGroup";

type ComponentMap = {
  [id: string]: {
    meta: {
      html_tag: string
      selected_element: string
      preceding_element: string
      succeeding_element: string
      variations?: {text: string}[]
    };
    text: string;
  };
};

export type SelectedComponent = {
  id: string
  html_tag: string
  selected_element: string
  preceding_element: string
  succeeding_element: string
  text: string
  variation_text?: string
}

const PersonalizationFactoryBodySettings = ({ content, campaign }) => {
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([])
  const [leftPanelSize, setLeftPanelSize] = useState(25);
  const [selectedTarget, setSelectedTarget] = useState(campaign.targets[0]["Targets for FE coding challenge"][0])
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
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
    const components = content.components as ComponentMap
    const variations = content.results

    if (variations && variations[0]) {
      setSelectedComponents(convertVariationsMapToSelectedComponents(variations[0].variations))
    } else if (components) {
      const initialSelected: SelectedComponent[] = Object.entries(components).map(([id, component]) => ({
        id,
        html_tag: component.meta.html_tag,
        selected_element: component.meta.selected_element,
        preceding_element: component.meta.preceding_element,
        succeeding_element: component.meta.succeeding_element,
        text: component.text,
      }))

  
      setSelectedComponents(initialSelected);
    }
  }, [])

  useEffect(() => {
    // Clear previous timeout if state changes before timer ends
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const payload = buildComponentPayload(selectedComponents);

      const updateContent = async () => {
        try {
          const content = await updateContentGroup(payload)
        } catch (error) {
          console.error("Failed to update content group:", error)
        }
      }
      
      updateContent()

    }, 1000)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    };
  }, [selectedComponents])

  const convertVariationsMapToSelectedComponents = (variationsMap: ComponentMap): SelectedComponent[] => {
    return Object.entries(variationsMap).map(([id, component]) => {
      const variation_text = component.meta.variations?.[0]?.text
      return {
        id,
        html_tag: component.meta.html_tag,
        selected_element: component.meta.selected_element,
        preceding_element: component.meta.preceding_element,
        succeeding_element: component.meta.succeeding_element,
        text: component.text,
        variation_text,
      }
    })
  }

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

  // console.log("content", content)
  // console.log("campaign", campaign)
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
