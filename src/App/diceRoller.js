import { DiceRoller } from "@dice-roller/rpg-dice-roller";

export const rollDice = () => {
  const roller = new DiceRoller();
  const roll = roller.roll("1d20");
  return {
    total: roll.total,
    notation: roll.notation,
    output: roll.output,
  };
};
