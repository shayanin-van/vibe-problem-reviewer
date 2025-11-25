import { db } from "./config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

let collectionName = "production";
if (window.location.hash === "#mathDemo") {
  collectionName = "mathDemo";
}

/**
 * Fetches all problems from Firestore and organizes them by unit > kaiSubtopic > kaiLevel > template
 * @returns {Promise<Object>} Organized problems structure
 */
export async function fetchProblemsStructure() {
  try {
    const problemsCol = collection(db, collectionName);
    const problemsSnapshot = await getDocs(problemsCol);
    const problems = {};

    problemsSnapshot.forEach((doc) => {
      const data = doc.data();
      const { unit, kaiSubtopic, kaiLevel, template } = data;

      if (!problems[unit]) {
        problems[unit] = {};
      }
      if (!problems[unit][kaiSubtopic]) {
        problems[unit][kaiSubtopic] = {};
      }
      if (!problems[unit][kaiSubtopic][kaiLevel]) {
        problems[unit][kaiSubtopic][kaiLevel] = [];
      }
      if (!problems[unit][kaiSubtopic][kaiLevel][template]) {
        problems[unit][kaiSubtopic][kaiLevel][template] = [];
      }

      problems[unit][kaiSubtopic][kaiLevel][template].push({
        id: doc.id,
        ...data,
      });
    });

    return problems;
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw error;
  }
}

/**
 * Fetches a single problem by ID
 * @param {string} problemId - The problem document ID
 * @returns {Promise<Object>} Problem data
 */
export async function fetchProblemById(problemId) {
  try {
    const problemDoc = doc(db, collectionName, problemId);
    const problemSnapshot = await getDoc(problemDoc);

    if (problemSnapshot.exists()) {
      return {
        id: problemSnapshot.id,
        ...problemSnapshot.data(),
      };
    } else {
      throw new Error("Problem not found");
    }
  } catch (error) {
    console.error("Error fetching problem:", error);
    throw error;
  }
}

/**
 * Updates a problem in Firestore
 * @param {string} problemId - The problem document ID
 * @param {Object} problemData - The problem data to update
 * @returns {Promise<void>}
 */
export async function updateProblem(problemId, problemData) {
  try {
    const problemDoc = doc(db, collectionName, problemId);
    await updateDoc(problemDoc, problemData);
  } catch (error) {
    console.error("Error updating problem:", error);
    throw error;
  }
}
