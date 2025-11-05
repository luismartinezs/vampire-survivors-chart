'use client';

import { useCallback, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";

export const SettingsWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const passivesShowUnions = useAppStore((state) => state.passivesShowUnions);
  const setPassivesShowUnions = useAppStore(
    (state) => state.setPassivesShowUnions
  );

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex items-center justify-center rounded-full border border-primary-400/80 p-3 text-primary-400/80 backdrop-blur-xs transition-colors duration-200 hover:border-primary-400 hover:text-primary-400"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "settings-modal" : undefined}
      >
        <Settings size={16} aria-hidden="true" />
        <span className="sr-only">Open settings</span>
      </button>

      {isOpen && (
        <div
          id="settings-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-sm rounded-lg bg-primary-900/95 p-6 shadow-xl backdrop-blur-md">
            <h2
              id="settings-modal-title"
              className="text-lg font-semibold text-white"
            >
              Settings
            </h2>
            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-3 text-sm text-primary-100">
                <input
                  type="checkbox"
                  checked={passivesShowUnions}
                  onChange={(event) => setPassivesShowUnions(event.target.checked)}
                  className="h-4 w-4 rounded border-primary-500 bg-transparent text-primary focus:ring-primary"
                />
                <span>passives show unions</span>
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md border border-primary-400/80 px-3 py-2 text-sm text-primary-100 transition-colors duration-200 hover:border-primary-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
