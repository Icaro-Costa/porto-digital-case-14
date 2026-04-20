"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  photoUrl?: string;
  isAiEnabled: boolean;
  isAdmin: boolean;
  createdAt: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers(q);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(search || undefined), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  async function toggleAi(user: AdminUser) {
    setToggling(user.id);
    try {
      await api.setAiAccess(user.id, !user.isAiEnabled);
      setUsers((prev) =>
        prev.map((u) => u.id === user.id ? { ...u, isAiEnabled: !u.isAiEnabled } : u)
      );
    } finally {
      setToggling(null);
    }
  }

  const aiCount = users.filter((u) => u.isAiEnabled).length;

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: "var(--nm-bg-deep)" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Gerenciar Usuários</h1>
        <p className="text-sm" style={{ color: "var(--nm-text-muted)" }}>
          Controle quem tem acesso às funcionalidades de IA
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total de usuários" value={users.length} icon="👥" />
        <StatCard label="IA habilitada" value={aiCount} icon="🤖" accent />
        <StatCard label="Sem acesso IA" value={users.length - aiCount} icon="🔒" />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "var(--nm-bg-card)",
            border: "1px solid var(--nm-border)",
            color: "var(--nm-text)",
          }}
        />
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--nm-bg-card)", border: "1px solid var(--nm-border)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--nm-accent)", borderTopColor: "transparent" }} />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center" style={{ color: "var(--nm-text-muted)" }}>
            Nenhum usuário encontrado
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--nm-border)" }}>
                {["Usuário", "Função", "Cadastro", "Acesso IA"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--nm-text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: i < users.length - 1 ? "1px solid var(--nm-border)" : "none",
                  }}
                >
                  {/* User info */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                        style={{
                          background: user.isAiEnabled
                            ? "linear-gradient(135deg, var(--nm-accent), var(--nm-accent-2, #7c3aed))"
                            : "var(--nm-bg-deep)",
                          color: "white",
                        }}
                      >
                        {user.photoUrl
                          ? <img src={user.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                          : user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--nm-text)" }}>
                          {user.name}
                          {user.isAdmin && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded-md"
                              style={{ background: "rgba(234,179,8,0.15)", color: "#eab308" }}>
                              admin
                            </span>
                          )}
                        </p>
                        <p className="text-xs" style={{ color: "var(--nm-text-muted)" }}>{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={
                        user.role === "teacher"
                          ? { background: "rgba(99,102,241,0.15)", color: "#818cf8" }
                          : { background: "rgba(16,185,129,0.15)", color: "#34d399" }
                      }
                    >
                      {user.role === "teacher" ? "Professor" : "Aluno"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-xs" style={{ color: "var(--nm-text-muted)" }}>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>

                  {/* AI Toggle */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleAi(user)}
                      disabled={toggling === user.id}
                      className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50"
                      style={{
                        background: user.isAiEnabled
                          ? "var(--nm-accent)"
                          : "var(--nm-bg-deep)",
                        border: "1px solid var(--nm-border)",
                      }}
                      title={user.isAiEnabled ? "Desativar IA" : "Ativar IA"}
                    >
                      <span
                        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                        style={{ left: user.isAiEnabled ? "calc(100% - 1.375rem)" : "0.125rem" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: {
  label: string; value: number; icon: string; accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: accent
          ? "linear-gradient(135deg, rgba(var(--nm-accent-rgb, 99,102,241),0.15), rgba(var(--nm-accent-rgb, 99,102,241),0.05))"
          : "var(--nm-bg-card)",
        border: `1px solid ${accent ? "rgba(var(--nm-accent-rgb,99,102,241),0.3)" : "var(--nm-border)"}`,
      }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs mt-1" style={{ color: "var(--nm-text-muted)" }}>{label}</div>
    </div>
  );
}
