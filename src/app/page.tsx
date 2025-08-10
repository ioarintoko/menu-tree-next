'use client';

import { useEffect, useState } from 'react';
import MenuTree from '@/components/MenuTree/MenuTree';
import MenuForm from '@/components/MenuTree/MenuForm';
import { getMenus, createMenu, updateMenu, deleteMenu, MenuItem } from '@/services/menuServices';
import { Plus, Loader2, Menu as MenuIcon, X } from 'lucide-react';

export default function MenuPage() {
  // ▶️ KEEP ALL YOUR EXISTING STATE AND FUNCTIONS EXACTLY AS THEY WERE
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [menuToEdit, setMenuToEdit] = useState<MenuItem | null>(null);
  const [parentForAdd, setParentForAdd] = useState<number | undefined>(undefined);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  // ✅ ONLY NEW UI-RELATED STATE
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // ===== YOUR EXISTING FUNCTIONS START =====
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
    setShowMobileMenu(false); // Close mobile menu after action
  };

  const handleAddChild = (parentId: number) => {
    setFormMode('add');
    setMenuToEdit(null);
    setParentForAdd(parentId);
    setShowMobileMenu(false); // Close mobile menu after action
  };

  const handleEdit = (menu: MenuItem) => {
    setFormMode('edit');
    setMenuToEdit(menu);
    setParentForAdd(undefined);
    setShowMobileMenu(false); // Close mobile menu after action
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
      setMenuToEdit(null);
      setParentForAdd(undefined);
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan data menu');
    }
  };
  // ===== YOUR EXISTING FUNCTIONS END =====

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2">
          <MenuIcon size={24} />
        </button>
        <h1 className="text-xl font-bold">Menu Manager</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Sidebar - Now Responsive */}
      <aside className={`
        ${showMobileMenu ? 'block' : 'hidden'} 
        md:block w-full md:w-1/4 bg-white border-r border-gray-200 p-4 md:p-6
        absolute md:relative inset-0 z-10 md:z-auto
      `}>
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setShowMobileMenu(false)} className="p-2">
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Menus</h2>
          
          <button
            onClick={handleAddRoot}
            className="p-2 md:p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700"
            title="Tambah Menu Root"
          >
            <Plus size={20} className="md:size-4" />
          </button>
        </div>
        
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {menuData.length > 0 ? (
          <div className="overflow-y-auto h-[calc(100%-100px)]">
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

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <h1 className="hidden md:block text-3xl font-bold text-gray-900 mb-6">
          Menu Manager
        </h1>

        {menuToEdit || (formMode === 'add') ? (
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
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
            <p className="md:hidden text-center">
              <button 
                onClick={() => setShowMobileMenu(true)}
                className="text-blue-600 underline"
              >
                Tap to open menu
              </button>
            </p>
            <p className="hidden md:block">
              Pilih menu di sisi kiri atau klik tombol tambah untuk memulai.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}