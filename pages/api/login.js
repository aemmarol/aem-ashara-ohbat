// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Airtable from "airtable";

const airtableUserBase = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
}).base("apptK8T882icYTvY7");

const userTableList = airtableUserBase("Users");

export const login = async (its,password) => {
  const userData = await userTableList
    .select({
      view: "Grid view",
      filterByFormula: `({its} = '${its}')`,
    })
    .firstPage();

  if (!userData.length) {
    return { type: "error", msg: "user not found" };
  } else {
    const dbPassword = userData[0].fields.password;
    if(dbPassword !== password){
      return { type: "error", msg: "incorrect password" };
    }
    let data = userData[0].fields;
    delete data.password
    return { type: "success", data };
  }
};
