import { db } from './config';
import { collection, getDocs, query, orderBy, addDoc, doc, updateDoc } from 'firebase/firestore';

// Mock data to be used until Firebase is configured by the user
const mockAthletes = [
  { position: 1, name: "João 'Trator' Silva", category: "Masculino RX", box: "Beira Rio CrossFit", score: 1000 },
  { position: 2, name: "Maria 'Fênix' Costa", category: "Feminino RX", box: "CrossFit Caxias", score: 980 },
  { position: 3, name: "Pedro 'Animal' Souza", category: "Masculino RX", box: "Beira Rio CrossFit", score: 950 },
  { position: 4, name: "Ana 'Máquina' Pereira", category: "Feminino Intermediário", box: "Niterói CrossFit", score: 945 },
  { position: 5, name: "Lucas 'The Rock' Ferreira", category: "Masculino Scale", box: "Beira Rio CrossFit", score: 920 },
  { position: 6, name: "Juliana 'Juggernaut' Alves", category: "Feminino RX", box: "CrossFit Caxias", score: 910 },
  { position: 7, name: "Carlos 'Viking' Andrade", category: "Masculino Intermediário", box: "Beira Rio CrossFit", score: 890 },
  { position: 8, name: "Fernanda 'Búfalo' Lima", category: "Feminino Scale", box: "Niterói CrossFit", score: 875 },
];


/**
 * Fetches the list of athletes from Firestore.
 * If the Firestore database is empty or not configured, it returns mock data.
 * The function is ready to be used with a real Firestore backend.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of athlete objects.
 */
export const getAthletes = async () => {
  try {
    const athletesCollection = collection(db, 'athletes');
    const q = query(athletesCollection, orderBy('score', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn("Firebase data is empty, returning mock data. Please populate your Firestore 'athletes' collection.");
      // Sort mock data by score descending and add position
      return mockAthletes
        .sort((a, b) => b.score - a.score)
        .map((athlete, index) => ({ ...athlete, id: `mock-${index}`, position: index + 1 }));
    }

    const athletes = querySnapshot.docs.map((doc, index) => ({
      id: doc.id,
      position: index + 1, // Add position based on sorted order
      ...doc.data(),
    }));

    return athletes;
  } catch (error) {
    console.error("Error fetching athletes from Firebase: ", error);
    console.warn("Returning mock data due to Firebase error.");
    // Sort mock data by score descending and add position
    return mockAthletes
      .sort((a, b) => b.score - a.score)
      .map((athlete, index) => ({ ...athlete, id: `mock-${index}`, position: index + 1 }));
  }
};

/**
 * Adds a new athlete to the Firestore database.
 * @param {Object} athleteData - The data for the new athlete.
 * @returns {Promise} A promise that resolves when the athlete is added.
 */
export const addAthlete = async (athleteData) => {
  // A simple check to see if the config is still the placeholder
  if (db.app.options.apiKey === 'YOUR_API_KEY') {
    console.warn('Firebase is not configured. Simulating add athlete.');
    console.log('New athlete data:', athleteData);
    return Promise.resolve();
  }

  try {
    const athletesCollection = collection(db, 'athletes');
    await addDoc(athletesCollection, {
      ...athleteData,
      score: 0, // Initialize score to 0
      time: '', // Initialize time
    });
  } catch (error) {
    console.error("Error adding athlete: ", error);
    throw new Error("Não foi possível adicionar o atleta.");
  }
};

/**
 * Updates the score and time for a specific athlete.
 * @param {string} athleteId - The ID of the athlete to update.
 * @param {Object} performanceData - An object containing the new score and time.
 * @returns {Promise} A promise that resolves when the update is complete.
 */
export const updateAthletePerformance = async (athleteId, performanceData) => {
  if (db.app.options.apiKey === 'YOUR_API_KEY') {
    console.warn('Firebase is not configured. Simulating performance update.');
    console.log(`Updating athlete ${athleteId} with:`, performanceData);
    return Promise.resolve();
  }

  try {
    const athleteRef = doc(db, 'athletes', athleteId);
    await updateDoc(athleteRef, performanceData);
  } catch (error) {
    console.error("Error updating athlete performance: ", error);
    throw new Error("Não foi possível atualizar o resultado do atleta.");
  }
};
