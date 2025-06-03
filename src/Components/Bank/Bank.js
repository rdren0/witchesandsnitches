import React, { useState } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";

const MoneyTracker = () => {
  // Store total money in Knuts for precision
  const [totalKnuts, setTotalKnuts] = useState(0);
  const [inputGalleons, setInputGalleons] = useState("");
  const [inputSickles, setInputSickles] = useState("");
  const [inputKnuts, setInputKnuts] = useState("");

  // Conversion rates
  const SICKLES_PER_GALLEON = 17;
  const KNUTS_PER_SICKLE = 29;
  const KNUTS_PER_GALLEON = SICKLES_PER_GALLEON * KNUTS_PER_SICKLE; // 493

  // Convert total Knuts to individual currencies
  const getBreakdown = (knuts) => {
    const galleons = Math.floor(knuts / KNUTS_PER_GALLEON);
    const remainingAfterGalleons = knuts % KNUTS_PER_GALLEON;
    const sickles = Math.floor(remainingAfterGalleons / KNUTS_PER_SICKLE);
    const finalKnuts = remainingAfterGalleons % KNUTS_PER_SICKLE;

    return { galleons, sickles, knuts: finalKnuts };
  };

  // Calculate total Knuts from all inputs
  const calculateTotalInputKnuts = () => {
    const galleons = parseFloat(inputGalleons) || 0;
    const sickles = parseFloat(inputSickles) || 0;
    const knuts = parseFloat(inputKnuts) || 0;

    return Math.round(
      galleons * KNUTS_PER_GALLEON + sickles * KNUTS_PER_SICKLE + knuts
    );
  };

  const addMoney = () => {
    const knutsToAdd = calculateTotalInputKnuts();
    if (knutsToAdd > 0) {
      setTotalKnuts((prev) => prev + knutsToAdd);
      clearInputs();
    }
  };

  const subtractMoney = () => {
    const knutsToSubtract = calculateTotalInputKnuts();
    if (knutsToSubtract > 0) {
      setTotalKnuts((prev) => Math.max(0, prev - knutsToSubtract));
      clearInputs();
    }
  };

  const clearInputs = () => {
    setInputGalleons("");
    setInputSickles("");
    setInputKnuts("");
  };

  const resetMoney = () => {
    setTotalKnuts(0);
    clearInputs();
  };

  const hasInput = inputGalleons || inputSickles || inputKnuts;

  const { galleons, sickles, knuts } = getBreakdown(totalKnuts);

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-amber-50 to-yellow-100 p-6 rounded-xl shadow-lg border-2 border-amber-300">
      <h1 className="text-2xl font-bold text-amber-800 text-center mb-6 font-serif">
        🪙 Gringotts Vault Tracker
      </h1>

      {/* Current Balance Display */}
      <div className="bg-amber-900 text-amber-100 p-4 rounded-lg mb-6 shadow-inner">
        <h2 className="text-lg font-semibold mb-3 text-center text-amber-200">
          Current Balance
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">🥇 Galleons:</span>
            <span className="text-xl font-bold text-yellow-300">
              {galleons}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">🥈 Sickles:</span>
            <span className="text-xl font-bold text-gray-300">{sickles}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">🥉 Knuts:</span>
            <span className="text-xl font-bold text-amber-300">{knuts}</span>
          </div>
        </div>
        <div className="border-t border-amber-700 mt-3 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium text-amber-200">
              Total (in Knuts):
            </span>
            <span className="text-lg font-bold text-amber-100">
              {totalKnuts}
            </span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-4 rounded-lg shadow-inner border border-amber-200 mb-4">
        <h3 className="text-md font-semibold text-amber-800 mb-3">
          Add/Remove Money
        </h3>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-amber-700 w-16">
              🥇 Galleons:
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputGalleons}
              onChange={(e) => setInputGalleons(e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-amber-700 w-16">
              🥈 Sickles:
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputSickles}
              onChange={(e) => setInputSickles(e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-amber-700 w-16">
              🥉 Knuts:
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={inputKnuts}
              onChange={(e) => setInputKnuts(e.target.value)}
              placeholder="0"
              className="flex-1 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={addMoney}
            disabled={!hasInput}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add
          </button>

          <button
            onClick={subtractMoney}
            disabled={!hasInput}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Minus size={18} />
            Remove
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetMoney}
        className="w-full bg-amber-700 hover:bg-amber-800 text-amber-100 px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <RotateCcw size={18} />
        Reset Vault
      </button>

      {/* Currency Reference */}
      <div className="mt-4 text-xs text-amber-700 bg-amber-100 p-3 rounded-md">
        <div className="font-semibold mb-1">Exchange Rates:</div>
        <div>1 Galleon = 17 Sickles = 493 Knuts</div>
        <div>1 Sickle = 29 Knuts</div>
      </div>
    </div>
  );
};

export default MoneyTracker;
