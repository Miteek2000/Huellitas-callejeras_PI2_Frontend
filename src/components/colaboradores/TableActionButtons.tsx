import React from 'react';

interface ActionButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
}

interface TableActionButtonsProps {
  buttons: ActionButton[];
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({ buttons }) => {
  return (
    <div className="flex gap-2">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          disabled={btn.disabled}
          onClick={btn.onClick}
          className={`px-4 py-1 rounded-full font-semibold text-white transition-opacity ${
            btn.variant === 'danger' ? 'bg-gray-500' : 'bg-indigo-900'
          } ${btn.disabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}`}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default TableActionButtons;
