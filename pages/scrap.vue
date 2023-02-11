<template>
  <div
    class="flex flex-col justify-center items-center min-h-screen bg-slate-400 gap-10"
  >
    <div
      class="flex flex-col justify-center items-center min-h-screen bg-slate-400 gap-10"
    >
      <button
        class="border-solid border-2 border-red-100 text-white bg-slate-900 py-3 px-6"
        @click="scrapClubSquad()"
      >
        SCRAP Club Squad
      </button>
      <button
        class="border-solid border-2 border-red-100 text-white bg-slate-900 py-3 px-6"
        @click="populatePlayerDatabase()"
      >
        Populate Players
      </button>
      <!-- <button
        class="border-solid border-2 border-red-100 text-white bg-slate-900 py-3 px-6"
        @click="scrapLeague()"
      >
        SCRAP Clubs From League
      </button> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const data = ref([]);
const allFetches = ref([]);

const scrapPlayerTransfers = async (e) => {
  allFetches.value.push($fetch(`/api/Scrap/scrapTransfer?link=${e.link}`));
};

const scrapClubSquad = async () => {
  console.log("Scrapping for squad Started");
  const res = await $fetch("/api/Scrap/scrapClubSquad");

  console.log("scrapping for squad done");

  res.data.forEach((e, i) => {
    scrapPlayerTransfers(e);
  });

  const resolved = Promise.all(allFetches.value);
  resolved.then((newData) => {
    newData.forEach((e, i) => {
      const set = new Set(e.data);
      const arrayData = [...set];
      data.value.push({
        name: res.data[i].name,
        position: res.data[i].position,
        shirtNumber: res.data[i].shirtNumber,
        clubs: arrayData,
      });
    });
    console.log(data.value);
    sendPlayerDetailToDb(data.value);
  });
};

const sendPlayerDetailToDb = async (e) => {
  let updatedArray;
  const finalArray = [];
  const sendToDb = await $fetch("/api/Players/addPlayers", {
    method: "post",
    body: e,
  });

  sendToDb.body.forEach((e, i) => {
    updatedArray = e.clubs.filter((elem, i) => {
      return elem !== "Removed";
    });
    e.clubs = updatedArray;
    finalArray.push({
      id: i + 506,
      name: e.name,
      shirtNumber: e.shirtNumber,
      position: e.position,
      currentClub: e.clubs[0],
      clubsPlayedFor: e.clubs,
    });
  });

  console.log(finalArray)

  addPlayerToDatabase(finalArray);
};

const addPlayerToDatabase = async (e) => {
  const addPlayerToDatabase = await $fetch("/api/Players/addPlayerToDatabase", {
    method: "post",
    body: e,
  });
  console.log(addPlayerToDatabase);
};

const populatePlayerDatabase = async () => {
  const populatedDb = await $fetch("/api/Players/populatePlayers");
  console.log(populatedDb);
};

const scrapLeague = async () => {
  const body = [];
  console.log("Scrapping Started");
  const res = await $fetch(`/api/Scrap/scrapLeague`);

  console.log("scrapping done");
  console.log(res);

  res.data.forEach((e, i) => {
    body.push(e);
  });

  const addToDb = await $fetch("/api/Clubs/addClubs", {
    method: "post",
    body: body,
  });

  console.log(addToDb);
};
</script>
