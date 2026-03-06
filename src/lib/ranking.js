const TIME_BASED_EVENTS = ["26_2", "26_3"];

/**
 * Gets the raw numeric score, supporting both the old and new data structures.
 * @param {object | number} score - The score object or number.
 * @returns {number} The numeric value of the score.
 */
const getScoreValue = (score) => {
  if (typeof score === 'number') {
    return score; // Legacy support
  }
  if (score && typeof score.value === 'number') {
    return score.value;
  }
  return 0; // Default for missing or invalid scores
};

/**
 * Calculates the ranks for a single event, handling ties correctly.
 * @param {Array<Object>} sortedAthletes - Athletes sorted according to the event's rules.
 * @param {string} eventId - The ID of the event (e.g., "26_1").
 * @returns {Array<Object>} Athletes with their rank for the event.
 */
const assignRanks = (sortedAthletes, eventId) => {
  let rank = 1;
  const rankedAthletes = [];

  for (let i = 0; i < sortedAthletes.length; i++) {
    let currentAthlete = sortedAthletes[i];
    let prevAthlete = i > 0 ? sortedAthletes[i - 1] : null;

    if (prevAthlete) {
      const currentScore = currentAthlete.scores?.[eventId];
      const prevScore = prevAthlete.scores?.[eventId];

      // If scores are different, the new rank is the current position (i + 1)
      if (getScoreValue(currentScore) !== getScoreValue(prevScore) || currentScore?.isCapped !== prevScore?.isCapped) {
        rank = i + 1;
      }
    }

    // Add the rank to a new object to avoid mutating the original
    rankedAthletes.push({
      ...currentAthlete,
      rank: rank,
    });
  }
  return rankedAthletes;
};

/**
 * Calculates and assigns ranks to athletes for a specific workout (event).
 * @param {Array<Object>} athletes - The list of all athletes.
 * @param {string} eventId - The identifier for the event (e.g., "26_2").
 * @returns {Array<Object>} A new array of athletes, sorted and ranked for the given event.
 */
export const calculateWorkoutRanks = (athletes, eventId) => {
  // Create a deep copy to avoid mutations
  const athletesCopy = JSON.parse(JSON.stringify(athletes));

  // Separate athletes who participated from those who did not
  const participants = athletesCopy.filter(a => a.scores?.[eventId] !== undefined && getScoreValue(a.scores[eventId]) > 0);
  const nonParticipants = athletesCopy.filter(a => !participants.some(p => p.id === a.id));

  // FIX: If no one participated, assign a penalty rank and return early.
  // The penalty is a rank equal to the total number of athletes in the current context + 1.
  if (participants.length === 0) {
    athletesCopy.forEach(a => a.rank = athletesCopy.length + 1);
    return athletesCopy;
  }
  
  // --- The rest is the original logic for ranking actual participants ---
  let sortedParticipants;

  // Sort participants based on the event type
  if (TIME_BASED_EVENTS.includes(eventId)) {
    const finished = participants.filter(a => !a.scores[eventId].isCapped);
    const capped = participants.filter(a => a.scores[eventId].isCapped);

    finished.sort((a, b) => getScoreValue(a.scores[eventId]) - getScoreValue(b.scores[eventId]));
    capped.sort((a, b) => getScoreValue(b.scores[eventId]) - getScoreValue(a.scores[eventId]));
    
    sortedParticipants = [...finished, ...capped];
  } else {
    sortedParticipants = participants.sort((a, b) => getScoreValue(b.scores[eventId]) - getScoreValue(a.scores[eventId]));
  }
  
  // Assign ranks to the sorted participants
  const rankedParticipants = assignRanks(sortedParticipants, eventId);

  // Assign the correct last-place rank to non-participants
  const rankForNonParticipants = participants.length + 1;
  nonParticipants.forEach(a => a.rank = rankForNonParticipants);

  // Return the full list of ranked athletes
  return [...rankedParticipants, ...nonParticipants].sort((a,b) => a.rank - b.rank);
};


/**
 * Calculates the overall ranking based on points from all events.
 * Lower total points is better.
 * @param {Array<Object>} athletes - The list of all athletes.
 * @param {Array<string>} eventIds - A list of all event IDs.
 * @returns {Array<Object>} Athletes sorted by overall rank, with total points and individual ranks.
 */
export const calculateOverallRanking = (athletes, eventIds) => {
  // Create a deep copy to avoid mutations
  const athletesWithOverallPoints = JSON.parse(JSON.stringify(athletes));
  
  // A map to hold the calculated ranks for each event to avoid re-calculating
  const eventRanksCache = new Map();

  // First, calculate the rank for each athlete in each event and store it
  eventIds.forEach(eventId => {
    const rankedAthletesForEvent = calculateWorkoutRanks(athletes, eventId);
    eventRanksCache.set(eventId, new Map(rankedAthletesForEvent.map(a => [a.id, a.rank])));
  });

  // Now, calculate total points and individual ranks for each athlete
  athletesWithOverallPoints.forEach(athlete => {
    athlete.totalPoints = 0;
    athlete.individualRanks = {};

    eventIds.forEach(eventId => {
      const rankForEvent = eventRanksCache.get(eventId)?.get(athlete.id) || athletes.length; // Default to last place if no rank
      athlete.individualRanks[eventId] = rankForEvent;
      athlete.totalPoints += rankForEvent;
    });
  });

  // Sort athletes by total points ASC (fewer points is better)
  athletesWithOverallPoints.sort((a, b) => a.totalPoints - b.totalPoints);

  return athletesWithOverallPoints;
};
