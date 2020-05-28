import pool from "./pool";

export const quedy = (text, params) => {
  return new Promise((resolve, reject) => {
    pool
      .query(text, params)
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
