import { db } from "./config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

/**
 * Fetches all problems from Firestore and organizes them by unit > lesson > subtopic
 * @returns {Promise<Object>} Organized problems structure
 */
export async function fetchProblemsStructure() {
  try {
    const problemsCol = collection(db, "99demo");
    const problemsSnapshot = await getDocs(problemsCol);
    const problems = {};

    problemsSnapshot.forEach((doc) => {
      const data = doc.data();
      const { unit, lesson, subtopic } = data;

      if (!problems[unit]) {
        problems[unit] = {};
      }
      if (!problems[unit][lesson]) {
        problems[unit][lesson] = {};
      }
      if (!problems[unit][lesson][subtopic]) {
        problems[unit][lesson][subtopic] = [];
      }

      problems[unit][lesson][subtopic].push({
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
    const problemDoc = doc(db, "99demo", problemId);
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
    const problemDoc = doc(db, "99demo", problemId);
    await updateDoc(problemDoc, problemData);
  } catch (error) {
    console.error("Error updating problem:", error);
    throw error;
  }
}
