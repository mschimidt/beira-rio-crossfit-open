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
 * Calculates and assigns ranks ONLY to athletes who participated in a specific workout.
 * @param {Array<Object>} athletes - The list of all athletes.
 * @param {string} eventId - The identifier for the event (e.g., "26_2").
 * @returns {Array<Object>} A new array containing ONLY the ranked participants.
 */
export const calculateWorkoutRanks = (athletes, eventId) => {
  // Create a deep copy to avoid mutations
  const athletesCopy = JSON.parse(JSON.stringify(athletes));

  // 1. Get only the athletes who participated in this event.
  const participants = athletesCopy.filter(a => a.scores?.[eventId] !== undefined && getScoreValue(a.scores[eventId]) > 0);

  // If no one participated, return an empty list.
  if (participants.length === 0) {
    return [];
  }
  
  // 2. Sort the participants based on the event type.
  let sortedParticipants;
  if (TIME_BASED_EVENTS.includes(eventId)) {
    const finished = participants.filter(a => !a.scores[eventId].isCapped);
    const capped = participants.filter(a => a.scores[eventId].isCapped);

    finished.sort((a, b) => getScoreValue(a.scores[eventId]) - getScoreValue(b.scores[eventId])); // Lower time is better
    capped.sort((a, b) => getScoreValue(b.scores[eventId]) - getScoreValue(a.scores[eventId])); // Higher reps are better
    
    sortedParticipants = [...finished, ...capped];
  } else {
    sortedParticipants = participants.sort((a, b) => getScoreValue(b.scores[eventId]) - getScoreValue(a.scores[eventId])); // Higher score is better
  }
  
  // 3. Assign ranks ONLY to the participants.
  return assignRanks(sortedParticipants, eventId);
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

  // First, calculate the rank for each participating athlete in each event and store it
  eventIds.forEach(eventId => {
    const rankedAthletesForEvent = calculateWorkoutRanks(athletes, eventId);
    eventRanksCache.set(eventId, new Map(rankedAthletesForEvent.map(a => [a.id, a.rank])));
  });

  // Now, calculate total points and individual ranks for each athlete
  athletesWithOverallPoints.forEach(athlete => {
    athlete.totalPoints = 0;
    athlete.individualRanks = {};

    eventIds.forEach(eventId => {
      // If the athlete has a rank for the event, use it. Otherwise, the rank is 0.
      const rankForEvent = eventRanksCache.get(eventId)?.get(athlete.id) || 0;
      
      athlete.individualRanks[eventId] = rankForEvent;

      // Only add points if the athlete actually participated (rank > 0)
      if (rankForEvent > 0) {
        athlete.totalPoints += rankForEvent;
      }
    });
  });

  // Sort athletes by total points ASC (fewer points is better)
  athletesWithOverallPoints.sort((a, b) => {
    // Athletes with 0 total points (no events done) should be at the end.
    if (a.totalPoints === 0 && b.totalPoints > 0) return 1;
    if (b.totalPoints === 0 && a.totalPoints > 0) return -1;
    // For athletes who have participated, fewer points is better.
    return a.totalPoints - b.totalPoints;
  });

  return athletesWithOverallPoints;
};
