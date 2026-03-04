import { db } from './config';
import { collection, getDocs, query, addDoc, doc, updateDoc } from 'firebase/firestore';

// Mock data updated to the new structure
const mockAthletes = [
  { name: "João 'Trator' Silva", category: "Masculino RX", box: "Beira Rio CrossFit", scores: { "26.1": 194.1, "26.2": 0, "26.3": 0 } },
  { name: "Maria 'Fênix' Costa", category: "Feminino RX", box: "CrossFit Caxias", scores: { "26.1": 190.5, "26.2": 0, "26.3": 0 } },
  { name: "Pedro 'Animal' Souza", category: "Masculino RX", box: "Beira Rio CrossFit", scores: { "26.1": 188.0, "26.2": 0, "26.3": 0 } },
];

/**
 * Fetches the list of athletes from Firestore.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of athlete objects.
 */
export const getAthletes = async () => {
  try {
    const athletesCollection = collection(db, 'athletes');
    const querySnapshot = await getDocs(athletesCollection);

    if (querySnapshot.empty) {
      console.warn("Firebase data is empty, returning mock data.");
      return mockAthletes.map((athlete, index) => ({ ...athlete, id: `mock-${index}` }));
    }

    const athletes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return athletes;
  } catch (error) {
    console.error("Error fetching athletes from Firebase: ", error);
    console.warn("Returning mock data due to Firebase error.");
    return mockAthletes.map((athlete, index) => ({ ...athlete, id: `mock-${index}` }));
  }
};

/**
 * Adds a new athlete to the Firestore database.
 * @param {Object} athleteData - The data for the new athlete.
 * @returns {Promise} A promise that resolves when the athlete is added.
 */
export const addAthlete = async (athleteData) => {
  if (db.app.options.apiKey === 'YOUR_API_KEY') {
    console.warn('Firebase is not configured. Simulating add athlete.');
    console.log('New athlete data:', athleteData);
    return Promise.resolve();
  }

  try {
    const athletesCollection = collection(db, 'athletes');
    await addDoc(athletesCollection, {
      ...athleteData,
      scores: {
        "26.1": 0,
        "26.2": 0,
        "26.3": 0,
      },
    });
  } catch (error) {
    console.error("Error adding athlete: ", error);
    throw new Error("Não foi possível adicionar o atleta.");
  }
};

/**
 * Updates the score for a specific event for a given athlete.
 * @param {string} athleteId - The ID of the athlete to update.
 * @param {string} event - The name of the event (e.g., "26.1").
 * @param {number} score - The new score for the event.
 * @returns {Promise} A promise that resolves when the update is complete.
 */
export const updateAthletePerformance = async (athleteId, event, score) => {
  if (db.app.options.apiKey === 'YOUR_API_KEY') {
    console.warn('Firebase is not configured. Simulating performance update.');
    console.log(`Updating athlete ${athleteId}, event ${event} with score: ${score}`);
    return Promise.resolve();
  }

  try {
    const athleteRef = doc(db, 'athletes', athleteId);
    const scoreField = `scores.${event}`;
    
    await updateDoc(athleteRef, {
      [scoreField]: score,
    });
  } catch (error) {
    console.error("Error updating athlete performance: ", error);
    throw new Error("Não foi possível atualizar o resultado do atleta.");
  }
};
