/**
 * Formats the score for display based on its structure.
 * @param {object | number} score - The score object or legacy number.
 * @param {function} t - The translation function, for the word "reps".
 * @returns {string} The formatted score string.
 */
export const formatScore = (score, t) => {
  // Check for missing scores or scores that are explicitly zero
  const scoreValue = typeof score === 'number' ? score : score?.value;
  if (scoreValue === undefined || scoreValue === null || Number(scoreValue) === 0) {
    return 'N/A';
  }

  // Legacy support for old numeric scores
  if (typeof score === 'number') {
    return (Number(score) || 0).toFixed(1);
  }

  // New score object format
  if (score.isCapped) {
    // Ensure t is a function before calling it
    const repsText = typeof t === 'function' ? t('reps') : 'reps';
    return `${(Number(score.value) || 0).toFixed(1)} ${repsText}`;
  } else {
    const totalSeconds = Number(score.value) || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
};

/**
 * Gets the raw numeric score, supporting both the old and new data structures.
 * @param {object | number} score - The score object or number.
 * @returns {number} The numeric value of the score.
 */
export const getScoreValue = (score) => {
  if (typeof score === 'number') {
    return score; // Legacy support
  }
  if (score && typeof score.value === 'number') {
    return score.value;
  }
  return 0; // Default for missing or invalid scores
};
