'use client';

import { useEffect, useState } from 'react';
import MenuTree from '@/components/MenuTree/MenuTree';
import MenuForm from '@/components/MenuTree/MenuForm';
import { getMenus, createMenu, updateMenu, deleteMenu, MenuItem } from '@/services/menuServices';
import { Plus, Loader2 } from 'lucide-react';

// Asumsi Anda punya type ini di tempat lain, jika tidak, bisa tambahkan
// type MenuFormProps = {
//   mode: 'add' | 'edit';
//   menuToEdit?: MenuItem;
//   menuList: MenuItem[];
//   initialParentId?: number;
//   onSuccess: (data: MenuItem) => void;
//   onCancel: () => void;
// };

export default function MenuPage() {
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [menuToEdit, setMenuToEdit] = useState<MenuItem | null>(null);
  const [parentForAdd, setParentForAdd] = useState<number | undefined>(undefined);

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

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

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddRoot = () => {
    setFormMode('add');
    setMenuToEdit(null);
    setParentForAdd(undefined);
  };

  const handleAddChild = (parentId: number) => {
    setFormMode('add');
    setMenuToEdit(null);
    setParentForAdd(parentId);
  };

  const handleEdit = (menu: MenuItem) => {
    setFormMode('edit');
    setMenuToEdit(menu);
    setParentForAdd(undefined);
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
      fetchMenus();
      // Opsional: reset form setelah sukses
      setMenuToEdit(null);
      setParentForAdd(undefined);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data menu');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Kiri - Menu Tree */}
      <aside className="w-1/4 bg-white border-r border-gray-200 p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Menus</h2>
          <button
            onClick={handleAddRoot}
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

        {menuData.length > 0 ? (
          <div className="overflow-y-auto flex-grow">
            <MenuTree
              data={menuData}
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

      {/* Konten Kanan - Menu Form atau Detail */}
      <main className="w-3/4 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Menu Manager
        </h1>

        {/* Tampilkan MenuForm jika ada item yang diedit atau ditambahkan */}
        {menuToEdit || (formMode === 'add') ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <MenuForm
              mode={formMode}
              menuToEdit={menuToEdit ?? undefined}
              menuList={menuData}
              initialParentId={parentForAdd}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setMenuToEdit(null);
                setParentForAdd(undefined);
                setFormMode('add');
              }}
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
}