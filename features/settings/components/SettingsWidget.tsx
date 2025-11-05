"use client";

import { useCallback, useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { useAppStore } from "@/hooks/useAppStore";
import { Checkbox } from "./Checkbox";

export const SettingsWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const passivesShowDerivedRecipes = useAppStore(
    (state) => state.passivesShowDerivedRecipes
  );
  const setPassivesShowDerivedRecipes = useAppStore(
    (state) => state.setPassivesShowDerivedRecipes
  );
  const weaponsShowDerivedRecipes = useAppStore(
    (state) => state.weaponsShowDerivedRecipes
  );
  const setWeaponsShowDerivedRecipes = useAppStore(
    (state) => state.setWeaponsShowDerivedRecipes
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
              <div>
                <h3 className="text-sm font-medium text-primary-100">
                  Show derived recipes
                </h3>
                <div className="mt-2 space-y-3">
                  <Checkbox
                    label="for passives"
                    checked={passivesShowDerivedRecipes}
                    onChange={(event) =>
                      setPassivesShowDerivedRecipes(event.target.checked)
                    }
                  />
                  <Checkbox
                    label="for weapons"
                    checked={weaponsShowDerivedRecipes}
                    onChange={(event) =>
                      setWeaponsShowDerivedRecipes(event.target.checked)
                    }
                  />
                </div>
              </div>
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
