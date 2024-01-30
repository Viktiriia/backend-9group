const calculateDailyNorm = (gender, weight, activeTime) => {
  const waterNorm =
    gender === "male"
      ? weight * 0.04 + activeTime * 0.6
      : weight * 0.03 + activeTime * 0.4;
  return waterNorm.toFixed(1);
};

module.exports = { calculateDailyNorm };
