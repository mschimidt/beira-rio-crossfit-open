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
  
  let sortedAthletes;

  if (TIME_BASED_EVENTS.includes(eventId)) {
    // Separate athletes into three groups: finished, capped, and non-participants
    const finished = [];
    const capped = [];
    const didNotParticipate = [];

    athletesCopy.forEach(a => {
      const score = a.scores?.[eventId];
      const value = getScoreValue(score);

      if (value > 0) {
        if (score.isCapped) {
          capped.push(a);
        } else {
          finished.push(a);
        }
      } else {
        didNotParticipate.push(a);
      }
    });

    // Sort finished athletes by time ASC (lower is better)
    finished.sort((a, b) => getScoreValue(a.scores[eventId]) - getScoreValue(b.scores[eventId]));

    // Sort capped athletes by reps DESC (higher is better)
    capped.sort((a, b) => getScoreValue(b.scores[eventId]) - getScoreValue(a.scores[eventId]));
    
    // Finished athletes rank higher than capped, who rank higher than non-participants
    sortedAthletes = [...finished, ...capped, ...didNotParticipate];
  } else {
    // For reps-based events (like 26_1), sort all by score DESC (higher is better)
    // Athletes with a score of 0 will automatically be placed at the end.
    sortedAthletes = athletesCopy.sort((a, b) => {
      const scoreA = getScoreValue(a.scores?.[eventId]);
      const scoreB = getScoreValue(b.scores?.[eventId]);
      return scoreB - scoreA;
    });
  }
  
  // Assign ranks based on the fully sorted list
  return assignRanks(sortedAthletes, eventId);
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
