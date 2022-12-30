<template>
  <div>
    <v-row>
      <!-- Sidebar -->
      <v-col cols="2">
        <sidebar_admin></sidebar_admin>
      </v-col>

      <!-- Create Game Form -->
      <v-col cols="10">
        <v-form class="px-10" ref="gameForm" v-model="gameForm">
          <!-- Title -->
          <v-text-field
            v-model="title"
            :counter="50"
            :rules="[
              (v) => !!v || 'Required',
              (v) =>
                (v && v.length <= 50) ||
                'Title must be less than 50 characters',
            ]"
            label="Title"
            required
          ></v-text-field>

          <!-- Overview -->
          <v-text-field
            v-model="overview"
            :counter="1000"
            :rules="[
              (v) => !!v || 'Required',
              (v) =>
                (v && v.length <= 1000) ||
                'Overview must be less than 1000 characters',
            ]"
            label="Overview"
            required
          ></v-text-field>

          <!-- Budget -->
          <v-text-field
            v-model="budget"
            type="number"
            suffix="MMK"
            max="999999"
            min="1"
            :rules="[
              (v) => !!v || 'Required',
              (v) =>
                (v && v > 0 && v <= 999999) ||
                'Buget must be between 0 and 999999 MMK',
            ]"
            label="Budget"
            required
          ></v-text-field>

          <!-- Category -->
          <v-select
            v-model="category"
            :items="gameCategoryList"
            item-text="name"
            item-value="id"
            :rules="[(v) => !!v || 'Required']"
            label="Category"
            required
          >
          </v-select>

          <!-- Platform -->
          <v-select
            v-model="platform"
            :items="gamePlatformList"
            item-text="name"
            item-value="id"
            :rules="[(v) => !!v || 'Required']"
            label="Platform"
            required
          >
          </v-select>

          <!-- Out of Stock -->
          <v-checkbox v-model="out_of_stock" label="Out of Stock"></v-checkbox>

          <!-- Poster -->
          <v-file-input
            v-model="poster"
            label="Poster"
            show-size
            prepend-icon="mdi-camera"
            placeholder="Choose Poster Image"
            accept="image/png, image/jpeg"
            :rules="[
              (v) => !!v || 'Required',
              (v) =>
                !v ||
                v.size < 10000000 ||
                'Image size should be less than 10 MB!',
            ]"
            @change="onChangePoster"
          ></v-file-input>

          <!-- Poster Preview -->
          <v-img
            v-if="posterPreviewPath != null"
            :src="posterPreviewPath"
            width="200"
            height="150"
            contain
          >
          </v-img>

          <!-- Trailer -->
          <v-file-input
            v-model="trailer"
            label="Trailer"
            show-size
            prepend-icon="mdi-video"
            placeholder="Choose Trailer"
            accept="video/mp4"
            :rules="[
              (v) => !!v || 'Required',
              (v) =>
                !v ||
                v.size < 100000000 ||
                'Image size should be less than 100 MB!',
            ]"
            @change="onChangeTrailer"
          ></v-file-input>

          <!-- Trailer Preview -->
          <video
            v-if="trailerPreviewPath != null"
            class="mb-2"
            width="100%"
            :src="trailerPreviewPath"
            controls
          ></video>

          <!-- Create Btn -->
          <v-btn
            :disabled="!gameForm"
            color="success"
            class="mt-4 mr-4"
            @click="createGame()"
          >
            <span v-if="!loading">Create Game</span>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-btn>

          <!-- Error Alert For Game -->
          <v-alert class="mt-3" v-show="errorAlert" dense type="error">
            Create Game Failed!
          </v-alert>
          <!-- Same Title Error Alert -->
          <v-alert class="mt-3" v-show="errorAlert2" dense type="error">
            Game with same title exists!
          </v-alert>
        </v-form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import sidebar_admin from "../components/sidebar_admin.vue";
import utils from "../utils/utils";

export default {
  name: "admin_create_game",
  components: { sidebar_admin },

  data() {
    return {
      gameForm: false,

      title: "",
      overview: "",
      budget: 0,
      title: "Game",
      overview: "Awesome Game",
      budget: 1000,
      category: 1,
      platform:1,
      out_of_stock: false,

      errorAlert: false,
      errorAlert2: false,

      loading: false,

      poster: null,
      posterPreviewPath: null,
      trailer: null,
      trailerPreviewPath: null,

      gameCategoryList: [],
      gamePlatformList: [],
    };
  },

  async created() {
    await this.fetchGameCategories();
    await this.fetchGamePlatform();
  },

  methods: {
    async fetchGameCategories() {
      const resp = await utils.http.get("/admin/category");
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.gameCategoryList = data;
        }
      }
    },
    async fetchGamePlatform() {
      const resp = await utils.http.get("/admin/platform");
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.gamePlatformList = data;
        }
      }
    },

    async createGame() {
      // Form Validation
      if (this.$refs.gameForm.validate()) {
        this.errorAlert = false;
        this.errorAlert2 = false;

        this.loading = true;

        // Step 1 -> Title Check

        let titleCheckOK = false;
        const respTitleCheck = await utils.http.get(
          "/admin/game/title/" + this.title
        );
        if (respTitleCheck && respTitleCheck.status === 200) {
          const data = await respTitleCheck.json();
          // Undefined, Null, True
          if (data && data === true) {
            this.errorAlert2 = true;
          } else {
            this.errorAlert2 = false;
            titleCheckOK = true;
          }
        } else {
          this.errorAlert2 = true;
        }

        if (titleCheckOK) {
          let respPosterData = null;
          let respTrailerData = null;

          // Step 2 -> Poster

          const respPoster = await utils.http.postMedia(
            "/admin/file/create",
            this.poster,
            this.poster.type
          );
          if (respPoster.status === 200) {
            respPosterData = await respPoster.text();
          } else {
            this.errorAlert = true;
          }

          // Step 2 -> Trailer

          const respTrailer = await utils.http.postMedia(
            "/admin/file/create",
            this.trailer,
            this.trailer.type
          );
          if (respTrailer.status === 200) {
            respTrailerData = await respTrailer.text();
          } else {
            this.errorAlert = true;
          }

          // Step 4 -> Create Game

          if (respPosterData && respTrailerData) {
            // Create Game API
            const respGame = await utils.http.post("/admin/game/create", {
              title: this.title,
              overview: this.overview,
              budget: this.budget,
              category: { id: this.category },
              platform: { id: this.platform },
              out_of_stock: this.out_of_stock,
              posterPath: respPosterData,
              trailerPath: respTrailerData,
            });
            if (respGame && respGame.status === 200) {
              this.$router.push({ path: "/admin" });
            } else {
              this.errorAlert = true;
            }
          }
        }

        this.loading = false;
      }
    },

    onChangePoster(poster) {
      this.posterPreviewPath = URL.createObjectURL(poster);
    },

    onChangeTrailer(trailer) {
      this.trailerPreviewPath = URL.createObjectURL(trailer);
    },
  },
};
</script>
