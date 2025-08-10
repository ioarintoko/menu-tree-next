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
}

const MenuTree: React.FC<MenuTreeProps> = ({
  data,
  onEdit,
  onDelete,
  onAddChild,
}) => {
  return (
    <ul className="pl-4 border-l border-gray-300">
      {data.map((item) => (
        <MenuNode
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
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
}> = ({ item, onEdit, onDelete, onAddChild }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="mb-1">
      <div
        className="flex items-center space-x-1 cursor-pointer select-none hover:bg-gray-100 p-1 rounded"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={16} className="text-gray-600" />
          ) : (
            <ChevronRight size={16} className="text-gray-600" />
          )
        ) : (
          <span className="w-4" />
        )}

        {item.url ? (
          <a
            href={item.url}
            className="text-blue-600 hover:underline flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            {item.name}
          </a>
        ) : (
          <span className="font-medium text-gray-700 flex-1">{item.name}</span>
        )}

        <div className="flex space-x-2 ml-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onAddChild(item.id)}
            title="Tambah Anak Menu"
            type="button"
          >
            <PlusCircle
              size={16}
              className="text-green-600 hover:text-green-800"
            />
          </button>
          <button onClick={() => onEdit(item)} title="Edit Menu" type="button">
            <Edit size={16} className="text-blue-600 hover:text-blue-800" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            title="Hapus Menu"
            type="button"
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
            <MenuTree
              data={item.children || []}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default MenuTree;
