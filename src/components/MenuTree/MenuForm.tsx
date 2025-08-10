import React, { useState, useEffect, JSX } from "react";
import { MenuItem } from "../../services/menuServices";

interface MenuFormProps {
  mode: "add" | "edit";
  menuToEdit?: MenuItem;
  menuList: MenuItem[]; // Menggunakan data pohon (tree)
  onSuccess: (data: MenuItem) => Promise<void>;
  onCancel: () => void;
  initialParentId?: number | null;
}

// Fungsi rekursif untuk membuat opsi dropdown dengan indentasi
const renderIndentedOptions = (
  items: MenuItem[],
  menuToEditId: number | undefined,
  depth: number = 0
): JSX.Element[] => {
  const options: JSX.Element[] = [];
  const indentation = "— ".repeat(depth);

  items.forEach((item) => {
    // Mencegah menu menjadi parent dari dirinya sendiri
    if (item.id !== menuToEditId) {
      options.push(
        <option key={item.id} value={item.id.toString()}>
          {indentation} {item.name}
        </option>
      );
      if (item.children && item.children.length > 0) {
        options.push(
          ...renderIndentedOptions(item.children, menuToEditId, depth + 1)
        );
      }
    }
  });
  return options;
};

const MenuForm: React.FC<MenuFormProps> = ({
  mode,
  menuToEdit,
  menuList,
  onSuccess,
  onCancel,
  initialParentId,
}) => {
  const [parentId, setParentId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [orderNo, setOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && menuToEdit) {
      setName(menuToEdit.name);
      setUrl(menuToEdit.url || "");
      setOrder(menuToEdit.orderNo);
      setParentId(menuToEdit.parentId ?? null);
    } else if (mode === "add") {
      setName("");
      setUrl("");
      setOrder(0);
      setParentId(initialParentId ?? null);
    }
  }, [mode, menuToEdit, initialParentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama menu wajib diisi");
      return;
    }
    if (orderNo < 0) {
      setError("Urutan harus bernilai positif");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // Logic lebih sederhana, langsung pakai parentId
      await onSuccess({ parentId, name, url, orderNo } as MenuItem);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {mode === "add" ? "Tambah Menu Baru" : "Edit Menu"}
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Menu</label>
          <input
            id="name"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
          <input
            id="url"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
            Parent
          </label>
          <select
            id="parentId"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={parentId === null ? "" : parentId.toString()}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setParentId(selectedValue === "" ? null : Number(selectedValue));
            }}
          >
            <option value="">-- Tidak ada --</option>
            {renderIndentedOptions(menuList, menuToEdit?.id)}
          </select>
        </div>
        <div>
          <label htmlFor="orderNo" className="block text-sm font-medium text-gray-700">Urutan</label>
          <input
            id="orderNo"
            type="number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={orderNo}
            onChange={(e) => setOrder(Number(e.target.value))}
            min={0}
            required
          />
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={loading}>
            {loading ? "Menyimpan..." : mode === "add" ? "Tambah" : "Simpan"}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500" disabled={loading}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};
export default MenuForm;