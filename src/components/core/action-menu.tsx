import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { MoreVertical } from "lucide-react";
import type React from "react";

export type ActionMenuItem = {
  label: string;
  icon?: React.ReactNode;
  tone?: "default" | "danger";
  onClick: () => void;
};

export function ActionMenu({ label = "Open actions", items }: { label?: string; items: ActionMenuItem[] }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label={label}
      >
        <MoreVertical className="h-4 w-4" />
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-700 bg-slate-900 p-1 text-sm text-slate-200 shadow-2xl shadow-black/40 focus:outline-none"
      >
        {items.map((item) => (
          <MenuItem key={item.label}>
            <button
              onClick={item.onClick}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition data-[focus]:bg-slate-800 ${
                item.tone === "danger" ? "text-red-200" : "text-slate-200"
              }`}
            >
              {item.icon && <span className="text-current [&_svg]:h-4 [&_svg]:w-4">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}
