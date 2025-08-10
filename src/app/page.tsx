'use client';

import { useEffect, useState } from 'react';
import MenuTree from '@/components/MenuTree/MenuTree';
import MenuForm from '@/components/MenuTree/MenuForm';
import { getMenus, createMenu, updateMenu, deleteMenu, MenuItem } from '@/services/menuServices';

export default function MenuPage() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Untuk form
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [menuToEdit, setMenuToEdit] = useState<MenuItem | null>(null);
  const [parentForAdd, setParentForAdd] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    setLoading(true);
    setError(null);
    try {
      const data = await getMenus();
      setMenuData(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat menu');
    } finally {
      setLoading(false);
    }
  }

  const handleAddRoot = () => {
    setFormMode('add');
    setMenuToEdit(null);
    setParentForAdd(undefined);
    setShowForm(true);
  };

  const handleAddChild = (parentId: number) => {
    setFormMode('add');
    setMenuToEdit(null);
    setParentForAdd(parentId);
    setShowForm(true);
  };

  const handleEdit = (menu: MenuItem) => {
    setFormMode('edit');
    setMenuToEdit(menu);
    setParentForAdd(undefined);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;
    try {
      await deleteMenu(id);
      fetchMenus();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus menu');
    }
  };

  const handleFormSuccess = async (data: MenuItem) => {
    try {
      if (formMode === 'add') {
        const payload = parentForAdd ? { ...data, parentId: parentForAdd } : data;
        await createMenu(payload);
      } else if (formMode === 'edit' && menuToEdit) {
        await updateMenu(menuToEdit.id, data);
      }
      setShowForm(false);
      fetchMenus();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data menu');
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  if (loading) return <p>Loading menu...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manajemen Menu</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleAddRoot}
      >
        Tambah Menu Root
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {menuData.length > 0 ? (
        <MenuTree
          data={menuData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddChild={handleAddChild}
        />
      ) : (
        <p>Data menu kosong</p>
      )}

      {showForm && (
        <div className="mt-6 p-4 border rounded bg-gray-50 max-w-md">
          <MenuForm
            mode={formMode}
            menuToEdit={menuToEdit ?? undefined}
            menuList={menuData}
            initialParentId={parentForAdd}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}
    </div>
  );
}
