import Web from "../contentTypes/web";
import { SelectedComponent } from "utils/sharedTypes";


type FactoryContentProps = {
  selectedComponents: SelectedComponent[]
  addComponent: (newComponent: SelectedComponent) => void
  removeComponent: (id: string) => void
}


const FactoryContent = (props: FactoryContentProps) => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <Web {...props}  />
    </div>
  );
};

export default FactoryContent;
