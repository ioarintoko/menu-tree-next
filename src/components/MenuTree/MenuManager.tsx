import React, { useEffect, useState } from "react";
import { MenuItem, getMenus, createMenu, updateMenu, deleteMenu } from "../../services/menuServices";
import MenuTree from "./MenuTree";
import MenuForm from "./MenuForm";
import { Plus, Loader2 } from "lucide-react";

// Helper function untuk meratakan menu (tidak digunakan lagi oleh MenuForm)
const flattenMenus = (menus: MenuItem[]): MenuItem[] => {
  let flatList: MenuItem[] = [];
  menus.forEach(menu => {
    flatList.push(menu);
    if (menu.children && menu.children.length > 0) {
      flatList = flatList.concat(flattenMenus(menu.children));
    }
  });
  return flatList;
};

const MenuManager: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [menuToEdit, setMenuToEdit] = useState<MenuItem | null>(null);
  const [parentForAdd, setParentForAdd] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const data = await getMenus();
      setMenus(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Gagal load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddRootClick = () => {
    setFormMode("add");
    setMenuToEdit(null);
    setParentForAdd(null);
    setActiveMenuId(null);
  };

  const handleAddChild = (parentId: number) => {
    setFormMode("add");
    setMenuToEdit(null);
    setParentForAdd(parentId);
    setActiveMenuId(null);
  };

  const handleEdit = (menu: MenuItem) => {
    setFormMode("edit");
    setMenuToEdit(menu);
    setParentForAdd(null);
    setActiveMenuId(menu.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus menu ini?')) return;
    try {
      await deleteMenu(id);
      fetchMenus();
      if (activeMenuId === id) {
        setActiveMenuId(null);
      }
    } catch (err: any) {
      window.alert(err.message);
    }
  };

  const handleFormSuccess = async (data: MenuItem) => {
    try {
      if (formMode === "add") {
        const payload = parentForAdd !== null ? { ...data, parentId: parentForAdd } : { ...data, parentId: null };
        await createMenu(payload);
      } else if (formMode === "edit" && menuToEdit) {
        await updateMenu(menuToEdit.id, data);
      }
      setMenuToEdit(null);
      setParentForAdd(null);
      setActiveMenuId(null);
      fetchMenus();
    } catch (err: any) {
      window.alert(err.message);
    }
  };

  const handleFormCancel = () => {
    setMenuToEdit(null);
    setParentForAdd(null);
    setActiveMenuId(null);
    setFormMode("add");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/4 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Menus</h2>
          <button
            onClick={handleAddRootClick}
            className="p-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            title="Tambah Menu Root"
          >
            <Plus size={18} />
          </button>
        </div>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {menus.length > 0 ? (
          <div className="overflow-y-auto flex-grow">
            <MenuTree
              data={menus}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
              activeMenuId={activeMenuId}
            />
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Data menu kosong
          </div>
        )}
      </aside>

      <main className="w-3/4 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Menu Manager
        </h1>

        {menuToEdit || (formMode === 'add') ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MenuForm
              mode={formMode}
              menuToEdit={menuToEdit ?? undefined}
              menuList={menus} // Menggunakan data pohon (tree)
              initialParentId={parentForAdd}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md h-full flex items-center justify-center text-gray-500">
            <p>Pilih menu di sisi kiri atau klik tombol tambah untuk memulai.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MenuManager;