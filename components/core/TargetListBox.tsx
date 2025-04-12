import React from 'react'

type TargetListBoxProps = {
    selectedTarget: string
    allTargets: string[]
    onChange: (newTarget: string) => void;
}

const TargetListBox = ({
  selectedTarget,
  allTargets,
  onChange,
}: TargetListBoxProps) => {
  return (
    <div className="w-full max-w-xs">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Target
      </label>
      <select
        value={selectedTarget}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 text-sm"
      >
        {allTargets.map((target) => (
          <option key={target} value={target}>
            {target}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TargetListBox
