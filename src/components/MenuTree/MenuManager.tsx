import React, { useEffect, useState } from "react";
import { MenuItem, getMenus, createMenu, updateMenu, deleteMenu } from "../../services/menuServices";
import MenuTree from "./MenuTree";
import MenuForm from "./MenuForm";

const MenuManager: React.FC = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [menuToEdit, setMenuToEdit] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [parentForAdd, setParentForAdd] = useState<number | undefined>(undefined);

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
    setParentForAdd(undefined);
    setShowForm(true);
  };

  const handleAddChild = (parentId: number) => {
    setFormMode("add");
    setMenuToEdit(null);
    setParentForAdd(parentId);
    setShowForm(true);
  };

  const handleEdit = (menu: MenuItem) => {
    setFormMode("edit");
    setMenuToEdit(menu);
    setParentForAdd(undefined);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const success = await deleteMenu(id);
      if (success) fetchMenus();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFormSuccess = async (data: MenuItem) => {
    try {
      if (formMode === "add") {
        const payload = parentForAdd ? { ...data, parentId: parentForAdd } : data;
        await createMenu(payload);
      } else if (formMode === "edit" && menuToEdit) {
        await updateMenu(menuToEdit.id, data);
      }
      setShowForm(false);
      fetchMenus();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Menu</h1>
      <button onClick={handleAddRootClick}>Tambah Menu Root</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <MenuTree
        data={menus}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddChild={handleAddChild}
      />

      {showForm && (
        <MenuForm
          mode={formMode}
          menuToEdit={menuToEdit ?? undefined}
          menuList={menus}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          initialParentId={parentForAdd}
        />
      )}
    </div>
  );
};

export default MenuManager;
