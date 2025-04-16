import Settings from "components/factory/stages/settings";
import { Button } from '@headlessui/react'
import { useUpdateContent, useContentGeneration } from "hooks/api/content";
import Spinner from "components/core/spinner";

export const PersonalizationFactoryControlSettings = ({
  content,
  selectedComponents,
  removeComponent,
  currentPaneWidth,
  fixedButtonsPaddingRight,
  targets,
  selectedTarget,
  changeSelectedTarget,
  onContentGenerated
}) => {
  const { updateContent, isLoading: isUpdateContentLoading  } = useUpdateContent()
  const { generateContent, isLoading: isGenerateContentLoading } = useContentGeneration()

  const handleSendClick = async () => {
    try {
      const { contentId } = content

      const updatePayload = {
        content_params: {
          targets: {
            "Targets for FE coding challenge": selectedTarget,
          },
        },
      }

      const updatedData = await updateContent({ id: contentId, payload: updatePayload });
      console.log("Content updated successfully:", updatedData);

      const generatePayload = {
        params: {
          joint_generation: false,
        },
      }

      const generatedData = await generateContent({ id: contentId, payload: generatePayload });
      console.log("Content generated successfully:", generatedData)

      if (generatedData) onContentGenerated(generatedData.variations)
        
    } catch (err) {
      console.error("Failed during content update or generation of content:", err)
    }
  }
  
  return (
    <>
      <div className="w-full h-full flex flex-col items-start">
        <div className="w-full grow flex flex-col p-6 gap-y-6 pb-40 text-neutral-700 bg-white">
          <div className="h-full">
            <Settings 
              selectedComponents={selectedComponents} 
              removeComponent={removeComponent} 
              targets={targets}
              selectedTarget={selectedTarget}
              changeSelectedTarget={changeSelectedTarget}
            />
            <div
              style={{
                width: `${currentPaneWidth}%`,
                paddingRight: `${fixedButtonsPaddingRight}px`,
              }}
              className="fixed bottom-0 z-10"
            >
              <Button 
                className="inline-flex items-center justify-center gap-2 rounded-md mb-4 bg-lime-500 py-1.5 px-3 text-sm/6 font-semibold text-black shadow-inner shadow-white/10 focus:outline-none w-full data-[hover]:bg-lime-400 data-[open]:bg-lime-500 data-[focus]:outline-1 data-[focus]:outline-black"
                disabled={!selectedTarget || !selectedComponents.length || isUpdateContentLoading || isGenerateContentLoading}
                onClick={handleSendClick}
              >
                {(isGenerateContentLoading || isUpdateContentLoading) ? <Spinner /> : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
