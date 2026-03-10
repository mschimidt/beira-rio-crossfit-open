import { getScoreValue } from "./utils";

const TIME_BASED_EVENTS = ["26_2", "26_3"];

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
    const currentAthlete = sortedAthletes[i];
    const prevAthlete = i > 0 ? sortedAthletes[i - 1] : null;

    if (prevAthlete) {
      const currentScore = currentAthlete.scores?.[eventId];
      const prevScore = prevAthlete.scores?.[eventId];

      // If scores are different, the new rank is the current position (i + 1)
      if (
        getScoreValue(currentScore) !== getScoreValue(prevScore) ||
        currentScore?.isCapped !== prevScore?.isCapped
      ) {
        rank = i + 1;
      }
    }

    // Add the rank to a new object to avoid mutating the original
    rankedAthletes.push({
      ...currentAthlete,
      rank,
    });
  }
  return rankedAthletes;
};

/**
 * Calculates and assigns ranks to all athletes for a specific workout,
 * including those who did not participate.
 * @param {Array<Object>} athletes - The list of all athletes.
 * @param {string} eventId - The identifier for the event (e.g., "26_2").
 * @returns {Array<Object>} A new array containing all athletes with their ranks.
 */
export const calculateWorkoutRanks = (athletes, eventId) => {
  // Create a deep copy to avoid mutations
  const athletesCopy = JSON.parse(JSON.stringify(athletes));

  // 1. Separate athletes who participated from those who didn't.
  const participants = athletesCopy.filter(
    (a) => a.scores?.[eventId] !== undefined && getScoreValue(a.scores[eventId]) > 0
  );
  const nonParticipants = athletesCopy.filter(
    (a) => a.scores?.[eventId] === undefined || getScoreValue(a.scores[eventId]) === 0
  );

  // If no one participated, rank everyone equally.
  if (participants.length === 0) {
    return athletesCopy.map((a) => ({ ...a, rank: 1 }));
  }

  // 2. Sort the participants based on the event type.
  let sortedParticipants;
  if (TIME_BASED_EVENTS.includes(eventId)) {
    const finished = participants.filter((a) => !a.scores[eventId].isCapped);
    const capped = participants.filter((a) => a.scores[eventId].isCapped);

    finished.sort(
      (a, b) => getScoreValue(a.scores[eventId]) - getScoreValue(b.scores[eventId])
    ); // Lower time is better
    capped.sort(
      (a, b) => getScoreValue(b.scores[eventId]) - getScoreValue(a.scores[eventId])
    ); // Higher reps are better

    sortedParticipants = [...finished, ...capped];
  } else {
    // Higher score is better
    sortedParticipants = participants.sort(
      (a, b) => getScoreValue(b.scores[eventId]) - getScoreValue(a.scores[eventId])
    );
  }

  // 3. Assign ranks to the participants.
  const rankedParticipants = assignRanks(sortedParticipants, eventId);

  // 4. Assign the last rank to non-participants.
  const lastRank = rankedParticipants.length > 0 ? rankedParticipants.length + 1 : 1;
  const rankedNonParticipants = nonParticipants.map((athlete) => ({
    ...athlete,
    rank: lastRank,
  }));

  // 5. Combine the ranked lists.
  return [...rankedParticipants, ...rankedNonParticipants];
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
  eventIds.forEach((eventId) => {
    const rankedAthletesForEvent = calculateWorkoutRanks(athletes, eventId);
    eventRanksCache.set(
      eventId,
      new Map(rankedAthletesForEvent.map((a) => [a.id, a.rank]))
    );
  });

  // Now, calculate total points and individual ranks for each athlete
  athletesWithOverallPoints.forEach((athlete) => {
    athlete.totalPoints = 0;
    athlete.individualRanks = {};

    eventIds.forEach((eventId) => {
      // Every athlete will have a rank.
      const rankForEvent = eventRanksCache.get(eventId)?.get(athlete.id) || 0;

      athlete.individualRanks[eventId] = rankForEvent;
      athlete.totalPoints += rankForEvent;
    });
  });

  // Sort athletes by total points ASC (fewer points is better)
  athletesWithOverallPoints.sort((a, b) => a.totalPoints - b.totalPoints);

  return athletesWithOverallPoints;
};
