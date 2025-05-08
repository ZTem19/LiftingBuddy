import { inject, Injectable, OnInit } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  runTransaction,
  doc,
  deleteDoc,
  Timestamp,
  QuerySnapshot,
} from '@angular/fire/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { Exercise, ExerciseSet, User } from '../data types/data-types';
import { eSet } from '../data types/data-types';
import { addDays } from '../utils/utils';
import exerciseData from '../exercises.json';
import { getEffortFactor } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class FetchService implements OnInit {
  constructor() {}

  firestore: Firestore = inject(Firestore);
  private userCollection = collection(this.firestore, 'users');
  private exerciseCollection = collection(this.firestore, 'exercises');
  private dataCollection = collection(this.firestore, 'data');
  private setsCollection = collection(this.firestore, 'sets');

  exerciseList?: Observable<Exercise[]>;

  ngOnInit(): void {
    this.exerciseList = this.getAllExercises();
  }

  // Get an array of exercises with their sets for a single day and user
  async getExerciseSetDataForDay(
    userId: string,
    day: Date
  ): Promise<ExerciseSet[]> {
    // query to get data documents for the given user and day

    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const dataQuery = query(
      this.dataCollection,
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay))
    );

    try {
      // retrieve data which match query
      const dataSnapshot = await getDocs(dataQuery);

      const exerciseSets: ExerciseSet[] = [];

      if (dataSnapshot.empty) {
        console.warn(
          'No data documents found for userId:',
          userId,
          'and day:',
          day
        );
        return []; // Return an empty array if no data documents are found
      }

      // Iterate through each data document
      for (const dataDoc of dataSnapshot.docs) {
        const data = dataDoc.data();
        const exerciseId = data['exerciseId'];
        const totalVolume = data['totalVolume'];

        // Fetch the exercise based on exerciseId
        const exercise = await this.getExerciseById(exerciseId);

        // Query to get sets associated with the data document
        const setsQuery = query(
          this.setsCollection,
          where('dataId', '==', dataDoc.id)
        );
        const setsSnapshot = await getDocs(setsQuery);
        const sets: eSet[] = setsSnapshot.docs.map(
          (setDoc: any) => setDoc.data() as eSet
        );

        // Construct the ExerciseSet object
        const exerciseSet: ExerciseSet = {
          exercise: exercise,
          sets: sets,
          totalVolume: totalVolume,
        };
        // add it to array
        exerciseSets.push(exerciseSet);
      }
      // return the array

      return exerciseSets;
    } catch (error) {
      throw error;
    }
  }

  // Get an exercise by its id
  async getExerciseById(exerciseId: string): Promise<Exercise> {
    // get exercise based on id
    const exerciseDocRef = doc(this.exerciseCollection, exerciseId);
    const exerciseSnapshot = await getDoc(exerciseDocRef);

    // if exercise exists return its data and id
    if (exerciseSnapshot.exists()) {
      return {
        id: exerciseSnapshot.id,
        ...(exerciseSnapshot.data() as Omit<Exercise, 'id'>),
      };
      // otherwise throw error
    } else {
      throw new Error(`Exercise with ID ${exerciseId} not found`);
    }
  }

  // adds group of sets for user, day, and exercise
  async addSetstoExerciseOnDay(
    userId: string,
    day: Date,
    exerciseId: string,
    sets: eSet[]
  ): Promise<string[]> {
    // transaction ensures if one thing fails nothing is committed
    return await runTransaction(this.firestore, async (transaction: any) => {
      // check if data already exists
      const dataQuery = query(
        this.dataCollection,
        where('userId', '==', userId),
        where('date', '==', Timestamp.fromDate(day)),
        where('exerciseId', '==', exerciseId) // Include exerciseId in the query
      );
      const dataSnapshot = await getDocs(dataQuery);
      let dataDocId: string;
      let existingDataDoc;

      // if exercise already exists for user and date then use it, otherwise create it and set its initial total volume to zero
      if (!dataSnapshot.empty) {
        existingDataDoc = dataSnapshot.docs[0];
        dataDocId = existingDataDoc.id;
      } else {
        const newDataDoc = await addDoc(this.dataCollection, {
          userId,
          date: Timestamp.fromDate(day),
          exerciseId,
          totalVolume: 0,
        });
        dataDocId = newDataDoc.id;
        existingDataDoc = { data: () => ({ totalVolume: 0 }) };
      }

      // Array to store the IDs of the newly created sets to return later
      const setIds: string[] = [];
      // Add sets and calculate toal volume
      let volume = 0;
      for (const set of sets) {
        const newSetDoc = await addDoc(this.setsCollection, {
          dataId: dataDocId,
          reps: set.numOfReps,
          weight: set.weight,
        });
        setIds.push(newSetDoc.id);
        const effortFactor = getEffortFactor(set.numOfReps);
        volume += Math.floor(set.numOfReps * set.weight * effortFactor);
      }

      //update total volume and return
      const newTotalVolume = existingDataDoc.data().totalVolume + volume;
      transaction.update(doc(this.firestore, 'data', dataDocId), {
        totalVolume: newTotalVolume,
      });
      return setIds;
    });
  }

  // deletes an exercise and all its sets for a given day
  async deleteExerciseWithSetsForDay(
    userId: string,
    day: Date,
    exerciseId: string
  ): Promise<void> {
    const dataRef = collection(this.firestore, 'data');
    const setsRef = collection(this.firestore, 'sets');

    //Find the data document  for the user, day, and exercise
    const dataQuery = query(
      dataRef,
      where('userId', '==', userId),
      where('date', '==', Timestamp.fromDate(day)),
      where('exerciseId', '==', exerciseId)
    );

    // if it does not exist return and do nothing
    const dataSnapshot = await getDocs(dataQuery);
    if (dataSnapshot.empty) {
      return;
    }

    // store document and id
    const dataDoc = dataSnapshot.docs[0];
    const dataId = dataDoc.id;

    // Find all sets associated with the dataId
    const setsQuery = query(setsRef, where('dataId', '==', dataId));
    const setsSnapshot = await getDocs(setsQuery);

    // Delete all set documents
    const deletePromises = setsSnapshot.docs.map((setDoc) =>
      deleteDoc(doc(this.firestore, 'sets', setDoc.id))
    );
    await Promise.all(deletePromises);

    // Delete the data document itself
    await deleteDoc(doc(this.firestore, 'data', dataId));

    console.log(
      `Deleted all sets and data for exercise ${exerciseId} on ${day.toDateString()}`
    );
  }

  async addExercise(name: string, muscleGroup: number, description: string) {
    const exerciseRef = collection(this.firestore, 'exercises');
    const newExerciseDoc = await addDoc(exerciseRef, {
      name: name,
      muscleGroup: muscleGroup,
      description: description,
    });
    return newExerciseDoc.id;
  }

  // Util methods to generate test data

  // Adds many exercise using data from a json file
  addExercisesFromJSON() {
    for (const exercise of exerciseData) {
      this.addExercise(
        exercise.name,
        exercise.muscleGroupWorked,
        exercise.description
      );
    }
  }

  // Adds three exercises and 2-4 sets for a day
  async addThreeExerciseSets(userId: string, day: Date): Promise<void> {
    try {
      // Get all exercises from Firestore
      const exerciseSnapshot = await getDocs(this.exerciseCollection);
      //  Use the snapshot to create an array of exercise objects
      const exercises: {
        id: string;
        name: string;
        description: string;
        muscleGroupWorked: number;
      }[] = [];
      exerciseSnapshot.forEach((doc: any) => {
        const exerciseData = doc.data();
        exercises.push({
          id: doc.id,
          name: exerciseData.name,
          description: exerciseData.description,
          muscleGroupWorked: exerciseData.muscleGroupWorked,
        });
      });

      // Check if there are any exercises and if not throw error
      if (exercises.length === 0) {
        throw new Error('No exercises found in Firestore!');
      }

      // Add 3 random exercises, each with a random number of sets (2-4)
      for (let i = 0; i < 3; i++) {
        // Pick a random exercise
        const randomIndex = Math.floor(Math.random() * exercises.length);
        const randomExerciseId = exercises[randomIndex].id;

        // Determine a random number of sets (between 2 and 4)
        const numberOfSets = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4 sets
        const sets: eSet[] = [];
        for (let j = 0; j < numberOfSets; j++) {
          // Generate random reps and weight
          const numOfReps = Math.floor(Math.random() * 7) + 6; // Between 6 and 12 reps
          const weight = Math.floor(Math.random() * 81) + 70; // Between 70 and 150 pounds
          sets.push({ dataId: '', numOfReps, weight });
        }

        // Add the exercise sets
        const setIds = await this.addSetstoExerciseOnDay(
          userId,
          day,
          randomExerciseId,
          sets
        );
        console.log(
          `Exercise ${
            i + 1
          } (Exercise ID: ${randomExerciseId}) added with ${numberOfSets} sets and IDs: ${setIds}`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // Add 3 random exercises and 2-4 random sets for a number of days
  async addExerciseSetsForXDays(
    userId: string,
    startDate: Date,
    numberOfDays: number
  ): Promise<void> {
    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(startDate, i);
      await this.addThreeExerciseSets(userId, currentDate);
    }
  }

  async getMuscleGroupsInDateRange(
    userid: string,
    startDate: Date,
    endDate: Date
  ): Promise<Map<string, ExerciseSet[]>> {
    const map = new Map<string, ExerciseSet[]>();

    const q = query(
      this.dataCollection,
      where('userId', '==', userid),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    let snapshot: QuerySnapshot = await getDocs(q);
    if (snapshot == null || snapshot.empty) {
      console.error('Data returned by query is null or none');
    }
    for (let doc of snapshot.docs) {
      let docData = doc.data();
      const exerciseId = docData['exerciseId'];
      const totalVolume = docData['totalVolume'];

      // Fetch the exercise based on exerciseId
      const exerciseTask = this.getExerciseById(exerciseId);

      // Query to get sets associated with the data document
      const setsQuery = query(
        this.setsCollection,
        where('dataId', '==', doc.id)
      );

      const setsTask = getDocs(setsQuery);

      const exercise = await exerciseTask;
      const setsSnap = await setsTask;

      const sets: eSet[] = setsSnap.docs.map(
        (setDoc: any) => setDoc.data() as eSet
      );

      // Construct the ExerciseSet object
      const exerciseSet: ExerciseSet = {
        exercise: exercise,
        sets: sets,
        totalVolume: totalVolume,
      };

      const date = new Date(docData['date']);
      const dateString = date.toISOString().split('T')[0];

      console.log(dateString);

      if (map.has(dateString)) {
        const exerciseSets = map.get(dateString);
        exerciseSets?.push(exerciseSet);
      } else {
        map.set(dateString, [exerciseSet]);
      }
    }
    console.log(
      'Got user data from: ' + startDate.toISOString() + '\n To: ' + endDate
    );
    console.log('Data: ');
    this.printMap(map);
    return map;
  }

  async getExerciseSetsInDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Map<string, ExerciseSet[]>> {
    // Map of data document id and the exercise id
    const docDataArray: DocData[] = [];

    // start query for exercises
    const exerciseListTask = getDocs(this.exerciseCollection);

    const dataQuery = query(
      this.dataCollection,
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate))
    );

    let dataSnapshot: QuerySnapshot = await getDocs(dataQuery);

    // query all docs at then map them back and construct them
    const ids = [];

    let exerciseId;
    let totalVolume;
    let date;
    for (const doc of dataSnapshot.docs) {
      let docData = doc.data();
      date = new Date(docData['date']['seconds'] * 1000);
      let dateString = date.toISOString().split('T')[0];
      exerciseId = docData['exerciseId'];
      totalVolume = docData['totalVolume'];

      ids.push(doc.id);
      docDataArray.push({
        id: doc.id,
        date: dateString,
        totalVolume: totalVolume,
        exersiceId: exerciseId,
      });
    }

    // Firestore max 'in' size for query
    const maxQuerySize = 10;

    // Query sets that reference data by id
    const setsTasks = [];
    let currentSetIds = [];
    for (let i = 0; i < ids.length; i++) {
      let string = ids[i];
      currentSetIds.push(string);
      if (currentSetIds.length == maxQuerySize || i == ids.length - 1) {
        setsTasks.push(
          getDocs(
            query(this.setsCollection, where('dataId', 'in', currentSetIds))
          )
        );
        currentSetIds = [];
      }
    }

    // Aggregate sets together
    const allSets: eSet[] = [];
    for (const task of setsTasks) {
      const setsSnap = await task;
      const sets: eSet[] = setsSnap.docs.map((setDoc) => {
        const set = setDoc.data() as eSet;
        set.numOfReps = setDoc.data()['reps'];
        return set;
      });
      sets.forEach((set) => allSets.push(set));
    }

    const exercises: Exercise[] = (await exerciseListTask).docs.map(
      (exerciseDoc) => {
        const data = exerciseDoc.data() as Exercise;
        data.id = exerciseDoc.id;
        return data;
      }
    );

    // Now that all the data is avaibleable constructj the final map
    const exerciseSetMap = new Map<string, ExerciseSet[]>();
    for (let doc of docDataArray) {
      // Get exercise for doc
      let finalExercise: Exercise | undefined;
      for (let exercise of exercises) {
        if (exercise.id == doc.exersiceId) {
          finalExercise = exercise;
        }
      }

      let finalSets: eSet[] = [];
      for (let set of allSets) {
        if (set.dataId == doc.id) {
          finalSets.push(set);
        }
      }

      if (!exerciseSetMap.has(doc.date)) {
        exerciseSetMap.set(doc.date, []);
      }

      if (finalExercise != null) {
        exerciseSetMap.get(doc.date)?.push({
          totalVolume: doc.totalVolume,
          exercise: finalExercise,
          sets: finalSets,
        });
      } else {
        console.error('No Exercise for :' + doc.date);
      }
    }
    return exerciseSetMap;
  }

  getAllExercises(): Observable<Exercise[]> {
    return collectionData(this.exerciseCollection, {
      idField: 'id',
    }) as Observable<Exercise[]>;
  }

  getUsers(): Observable<User[]> {
    return collectionData(this.userCollection, { idField: 'id' }) as Observable<
      User[]
    >;
  }

  private printMap(map: Map<any, any>) {
    const obj = Object.fromEntries(map);
    console.log(JSON.stringify(obj, null, 2));
  }

  async addExerciseData(
    exerciseId: string,
    totalvolume: number,
    userId: string,
    date: Date
  ): Promise<string> {
    const dataRef = await addDoc(this.dataCollection, {
      date: Timestamp.fromDate(date),
      exerciseId: exerciseId,
      totalVolume: totalvolume,
      userId: userId,
    });

    return dataRef.id;
  }

  async addSetData(sets: eSet[], dataId: string): Promise<void> {
    const setDocs = [];
    for (const set of sets) {
      setDocs.push(
        addDoc(this.setsCollection, {
          dataId: dataId,
          reps: set.numOfReps,
          weight: set.weight,
        })
      );
    }

    for (const doc of setDocs) {
      await doc;
    }
  }
}

interface DocData {
  id: string;
  date: string;
  totalVolume: number;
  exersiceId: string;
}
