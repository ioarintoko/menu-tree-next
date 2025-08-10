import React, { useState } from 'react';

interface MenuNodeProps {
  node: any;
}

const MenuNode: React.FC<MenuNodeProps> = ({ node }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2">
        {node.children?.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-2 py-1 bg-gray-200 rounded"
          >
            {expanded ? '-' : '+'}
          </button>
        )}
        <span>{node.name}</span>
      </div>
      {expanded && node.children?.map((child: any) => (
        <MenuNode key={child.id} node={child} />
      ))}
    </div>
  );
};

export default MenuNode;
