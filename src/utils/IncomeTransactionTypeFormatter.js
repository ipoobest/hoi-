const incomeTransactionTypes = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  ADJUSTMENT: "adjustment2",
  BONUS: "bonus",
  AFFILIATE: "affiliate-bet",
  BET_LOTTO: "bet-lotto",
  REWARD_LOTTO: "reward-lotto",
  BET_GAME: "bet-game",
  REWARD_GAME: "reward-game",
  CANCELLED: "cancelled",
  REWARD_SHOOT: "reward-yeekee-shot"
};

const getIncomeTransactionTypeByKey = key => {
  return incomeTransactionTypes[key] || key;
};

export { getIncomeTransactionTypeByKey, incomeTransactionTypes };
