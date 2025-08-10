// export async function getMenus() {
//   const res = await fetch("http://localhost:3000/api/menus", {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     cache: "no-store", // biar data fresh tiap request
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to fetch menus: ${res.statusText}`);
//   }

//   return res.json();
// }

// export const deleteMenu = async (id: number) => {
//   if (!window.confirm('Yakin ingin menghapus menu ini?')) return false;

//   const res = await fetch(`/menus/${id}`, { method: 'DELETE' });
//   if (!res.ok) throw new Error('Gagal menghapus menu');
//   return true;
// };

const BASE_URL = "http://localhost:3000/api";

export interface MenuItem {
  id: number; 
  parentId?: number;
  name: string;
  url?: string;
  orderNo: number;
    children?: MenuItem[];
}

export async function getMenus(): Promise<MenuItem[]> {
  const res = await fetch(`${BASE_URL}/menus`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch menus: ${res.statusText}`);
  }

  return res.json();
}

export async function createMenu(data: MenuItem): Promise<MenuItem> {
    if (data.parentId !== undefined && data.parentId !== null) {
        const pid = Number(data.parentId);
        if (!isNaN(pid)) {
            data.parentId = pid;
        }
    } else {
        data.parentId = 0; // ensure parentId is undefined if not set}
    }
  const res = await fetch(`${BASE_URL}/menus`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create menu: ${res.statusText}`);
  }

  return res.json();
}

export async function updateMenu(id: number, data: MenuItem): Promise<MenuItem> {
    if (id !== undefined && id !== null) {
        const uid = Number(id);
        if (!isNaN(uid)) {
            id = uid;
        }
    }

    if (data.parentId !== undefined && data.parentId !== null) {
        const pid = Number(data.parentId);
        if (!isNaN(pid)) {
            data.parentId = pid;
        }
    } else {
        data.parentId = 0; // ensure parentId is undefined if not set}
    }

    const res = await fetch(`${BASE_URL}/menus/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to update menu: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteMenu(id: number): Promise<boolean> {
  if (!window.confirm("Yakin ingin menghapus menu ini?")) return false;

  const res = await fetch(`${BASE_URL}/menus/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete menu: ${res.statusText}`);
  }

  return true;
}
