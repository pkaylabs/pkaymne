import React from "react";
import { useState } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

interface CustomSelectProps {
    items: { id: number; name: string }[];
    selectedItem?: { id: number; name: string };
    onChange: (item: { id: number; name: string }) => void;
    label: string;
    placeholder?: string;
    }

// CustomSelect Component
export default function CustomSelect({
  items,
  selectedItem,
  onChange,
  label,
  placeholder,
}: CustomSelectProps) {
  const defaultItem = placeholder ? { id: 0, name: placeholder } : items[0];
  const currentItem = selectedItem || defaultItem;

  return (
    <Listbox value={selectedItem} onChange={onChange}>
      <Label className="block text-xs text-gray-500">
        {label}
      </Label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-2.5 pl-3 pr-2 text-left text-gray-900 -outline-offset-1 outline-gray-300  sm:text-sm/6">
          <span className="col-start-1 row-start-1 truncate pr-6">
            {currentItem.name}
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 my-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in sm:text-sm"
        >
          {items.map((item) => (
            <ListboxOption
              key={item.id}
              value={item}
              className="group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:bg-primary-600 data-[focus]:text-white data-[focus]:outline-none"
            >
              <span className="block truncate font-normal group-data-[selected]:font-semibold">
                {item.name}
              </span>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 group-[&:not([data-selected])]:hidden group-data-[focus]:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
