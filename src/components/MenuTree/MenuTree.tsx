import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Edit,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { MenuItem } from "../../services/menuServices";

interface MenuTreeProps {
  data: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onAddChild: (parentId: number) => void;
  activeMenuId: number | null;
}

const MenuTree: React.FC<MenuTreeProps> = ({
  data,
  onEdit,
  onDelete,
  onAddChild,
  activeMenuId,
}) => {
  return (
    <ul className="pl-0 list-none">
      {data.map((item) => (
        <MenuNode
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
          activeMenuId={activeMenuId}
        />
      ))}
    </ul>
  );
};

const MenuNode: React.FC<{
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onAddChild: (parentId: number) => void;
  activeMenuId: number | null;
}> = ({ item, onEdit, onDelete, onAddChild, activeMenuId }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.id === activeMenuId;

  const handleItemClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
    onEdit(item);
  };

  return (
    <li className="relative group/item">
      {item.parentId !== null && (
        <span
          className="absolute left-0 w-4 h-full border-l border-gray-300"
          style={{ top: '-12px', height: 'calc(100% + 12px)' }}
        />
      )}
      <div
        className={`
          flex items-center space-x-1 cursor-pointer select-none rounded p-2 text-sm relative z-10
          ${isActive ? "bg-blue-100 text-blue-800 font-semibold" : "text-gray-700 hover:bg-gray-100"}
          ${item.parentId !== null ? 'pl-8' : ''}
        `}
      >
        {item.parentId !== null && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] border-b border-gray-300"
          />
        )}
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="p-1 -ml-1">
            {expanded ? (
              <ChevronDown size={16} className="text-gray-600" />
            ) : (
              <ChevronRight size={16} className="text-gray-600" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <span
          className="flex-1 font-medium"
          onClick={handleItemClick}
        >
          {item.name}
        </span>

        {/* Perubahan utama di sini - tombol action */}
        <div className="flex space-x-2 opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(item.id);
            }}
            title="Tambah Anak Menu"
            type="button"
            className="p-1 bg-green-50 rounded hover:bg-green-100"
          >
            <PlusCircle size={16} className="text-green-600 hover:text-green-800" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            title="Edit Menu"
            type="button"
            className="p-1 bg-blue-50 rounded hover:bg-blue-100"
          >
            <Edit size={16} className="text-blue-600 hover:text-blue-800" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            title="Hapus Menu"
            type="button"
            className="p-1 bg-red-50 rounded hover:bg-red-100"
          >
            <Trash2 size={16} className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="pl-4">
              <MenuTree
                data={item.children || []}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
                activeMenuId={activeMenuId}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default MenuTree;