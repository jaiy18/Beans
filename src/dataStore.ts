// YOU SHOULD MODIFY THIS OBJECT BELOW
const fs = require('fs');
import { DataBase } from './interfaces';
// let data = {
//   users: [],
//   channels: [],
//   dms: []
// };

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
// function getData() {
//   return data;
// }
export const DATABASE = './database.json';

// const setData = (newData: DataBase): void => {
//   const jsonData = JSON.stringify(newData);
//   fs.writeFileSync(DATABASE, jsonData);
// }

// const getData = (): DataBase => {
//   const json = fs.readFileSync(DATABASE);
//   const data = JSON.parse(String(json));
//   return data;
// }

const getData = (): DataBase => JSON.parse(String(fs.readFileSync(DATABASE)));
const setData = (newData: DataBase): void => fs.writeFileSync(DATABASE, JSON.stringify(newData, null, 2));

// Use set(newData) to pass in the entire data object, with modifications made
// function setData(newData: typeof data) {
//   data = newData;
// }

export { getData, setData };
