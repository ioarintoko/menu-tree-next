import React, { useState, useEffect } from "react";
import { MenuItem } from "../../services/menuServices";

interface MenuFormProps {
  mode: "add" | "edit";
  menuToEdit?: MenuItem;
  menuList: MenuItem[];
  onSuccess: (data: MenuItem) => Promise<void>;
  onCancel: () => void;
  initialParentId?: number;
}

const MenuForm: React.FC<MenuFormProps> = ({
  mode,
  menuToEdit,
  menuList,
  onSuccess,
  onCancel,
  initialParentId,
}) => {
  const [parentId, setParentId] = useState<number | undefined>(
    mode === "add" ? initialParentId : menuToEdit?.parentId
  );
  const [name, setName] = useState(menuToEdit?.name || "");
  const [url, setUrl] = useState(menuToEdit?.url || "");
  const [orderNo, setOrder] = useState(menuToEdit?.orderNo || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "edit" && menuToEdit) {
      setParentId(menuToEdit.parentId);
      setName(menuToEdit.name);
      setUrl(menuToEdit.url || "");
      setOrder(menuToEdit.orderNo);
    }
    if (mode === "add" && initialParentId !== undefined) {
      setParentId(initialParentId);
      setName("");
      setUrl("");
      setOrder(0);
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
      await onSuccess({ parentId, name, url, orderNo } as MenuItem);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded max-w-md">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Parent Menu</label>
      <select
        value={parentId ?? 0}
        onChange={(e) =>
          setParentId(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">-- Tidak ada --</option>
        {menuList.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <label>Nama Menu</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>URL</label>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />

      <label>Urutan</label>
      <input
        type="number"
        value={orderNo}
        onChange={(e) => setOrder(Number(e.target.value))}
        min={0}
        required
      />

      <div className="mt-4 space-x-2">
        <button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : mode === "add" ? "Tambah" : "Simpan"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading}>
          Batal
        </button>
      </div>
    </form>
  );
};

export default MenuForm;
