<template>
  <div class="my-5 container">
    <!-- Poster, Game Info -->
    <v-row class="ma-0">
      <!-- Poster -->
      <v-col cols="3" class="ma-0 pa-0">
        <v-img
          class="ma-0"
          :src="localDomain + game.posterPath"
          contain
        ></v-img>
      </v-col>

      <!-- Game Info -->
      <v-col cols="7">
        <div class="text-h3">{{ game.title }}</div>
        <div class="text-caption ml-2 my-2">{{ game.category.name }}</div>
        <div class="text-caption ml-2 my-2">{{ game.platform.name }}</div>
        <div class="text-body-1 ml-2 my-2">{{ game.budget }} Kyat</div>
        <div v-show="game.out_of_stock" class="text-body-1 ml-2 my-2">Out of Stock</div>
       
      </v-col>
    </v-row>

    <v-row justify="start" class="space px-16 pb-5">
      <v-card class="text-body-1 ml-2 my-4 pa-2">{{ game.overview }}</v-card>
    <div class="mx-2 mt-8">
      <h4 class="mb-3">Trailer</h4>
      <video
        class="mb-2"
        width="100%"
        :src="localDomain + game.trailerPath"
        controls
      ></video>
    </div>
    </v-row>
  </div>
</template>

<script>
import utils from "../utils/utils";

export default {
  name: "game_details",

  data() {
    return {
      localDomain: utils.constant.localDomain,

      loginUser: {},

      // Game ID from Path
      game_id: this.$route.params.id,
      game: {},
    };
  },

  async created() {
    // LoginUser from Vuex
    this.loginUser = this.$store.state.loginUser;
    this.$store.watch(
      () => {
        return this.$store.state.loginUser;
      },
      (newVal, oldVal) => {
        this.loginUser = newVal;
      },
      {
        deep: true,
      }
    );

    await this.fetchGame();
    await this.recordGameHistory();
  },

  methods: {
    async fetchGame() {
      const resp = await utils.http.get("/game/" + this.game_id);
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.game = data;
        }
      }
    },
    async recordGameHistory() {
      const resp = await utils.http.post("/record/add", {
        user: {
          id: this.loginUser.id,
        },
        game: {
          id: this.game_id,
        },
      });
      if (resp && resp.status !== 200) {
        console.log("Record Game History Failed!");
      }
    },
  },
};
</script>

<style scoped>
.container {
  margin-left: 10vw !important;
  margin-right: 10vw !important;
}
</style>
