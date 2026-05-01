export default {
  async up(db, client) {
    // TODO write your migration here.

    const ress = await db
      .collection("restaurants")
      .updateMany({}, { $set: { description: null } });

    console.log(ress);

    const count = await db.collection("restaurants").countDocuments();
    console.log("COUNT:", count);
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
  },
};
