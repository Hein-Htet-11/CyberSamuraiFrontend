<template>
  <div>
    <v-row>
      <!-- Sidebar -->
      <v-col cols="2">
        <sidebar_admin></sidebar_admin>
        <sidebar></sidebar>
      </v-col>

      <!-- Game table -->
      <v-col cols="10">
        <v-data-table
          :headers="headers"
          :items="gameList"
          :items-per-page="5"
          class="elevation-1"
        >
          <!-- Poster Img -->
          <template v-slot:item.posterPath="{ item }">
            <v-img
              :src="localDomain + item.posterPath"
              width="150"
              height="150"
              contain
            ></v-img>
          </template>

          <!-- Buttons -->
          <template v-slot:item.actions="{ item }">
            <!-- Update Game -->
            <v-btn
              class="mr-2"
              color="primary"
              fab
              x-small
              elevation="2"
              @click="onClickUpdateGame(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <!-- Delete Game Btn -->
            <v-btn
              color="red"
              fab
              dark
              x-small
              elevation="2"
              @click="
                toDeleteGame = item;
                deleteDialog = true;
              "
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Delete Game Dialog -->
    <v-dialog v-model="deleteDialog" width="400">
      <v-card>
        <!-- Dialog Heading -->
        <v-toolbar color="primary" dark>
          <div>Delete This Game?</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="deleteDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- Delete Game Info -->
        <v-card-text class="pa-4">
          <v-row dense>
            <v-col cols="3" class="font-weight-bold">ID</v-col>
            <v-col cols="7">{{ toDeleteGame.id }}</v-col>
            <v-col cols="3" class="font-weight-bold">Title</v-col>
            <v-col cols="7">{{ toDeleteGame.title }}</v-col>
          </v-row>
        </v-card-text>

        <!-- Delete Game Btn -->
        <v-card-actions class="justify-end">
          <v-btn color="red" dark @click="deleteGame()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Update Game Dialog -->
    <v-dialog v-model="updateDialog" width="500">
      <v-card>
        <!-- Dialog Heading -->
        <v-toolbar color="primary" dark>
          <div>Update This Game?</div>
          <v-spacer></v-spacer>
          <v-btn icon @click="updateDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <!-- Update Form -->
        <v-card-text class="pa-4">
          <v-form ref="gameForm" v-model="gameForm">
            <!-- Update Game Title -->
            <v-text-field
              v-model="toUpdateGame.title"
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

            <!-- Update Game Overview -->
            <v-text-field
              v-model="toUpdateGame.overview"
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

            <!-- Update Game Budget -->
            <v-text-field
              v-model="toUpdateGame.budget"
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

            <!-- Update Game Category -->
            <v-select
              v-model="toUpdateGame.category"
              :items="gameCategoryList"
              item-text="name"
              item-value="id"
              :rules="[(v) => !!v || 'Required']"
              label="Category"
              required
            >
            </v-select>

            <v-select
              v-model="toUpdateGame.platform"
              :items="gamePlatformList"
              item-text="name"
              item-value="id"
              :rules="[(v) => !!v || 'Required']"
              label="Platform"
              required
            >
            </v-select>

            <!-- Update Game Category -->
            <v-checkbox
              v-model="toUpdateGame.out_of_stock"
              label="Out of stock"
            ></v-checkbox>

            <!-- Update Game Poster -->
            <v-file-input
              v-model="toUpdateGame.poster"
              label="Poster"
              show-size
              prepend-icon="mdi-camera"
              placeholder="Choose Poster Image"
              accept="image/png, image/jpeg"
              :rules="[
                (v) =>
                  !v ||
                  v.size < 10000000 ||
                  'Image size should be less than 10 MB!',
              ]"
              @change="onChangePoster"
            ></v-file-input>

            <!-- Poster Preview -->
            <!-- Poster is not selected (null) -->
            <v-img
              v-if="posterPreviewPath == null"
              :src="localDomain + toUpdateGame.posterPath"
              width="200"
              height="150"
              contain
            >
            </v-img>
            <!-- Poster is selected (not null) -->
            <v-img
              v-if="posterPreviewPath != null"
              :src="posterPreviewPath"
              width="200"
              height="150"
              contain
            >
            </v-img>

            <!-- Update Game Trailer -->
            <v-file-input
              v-model="toUpdateGame.trailer"
              label="Trailer"
              show-size
              prepend-icon="mdi-video"
              placeholder="Choose Trailer"
              accept="video/mp4"
              :rules="[
                (v) =>
                  !v ||
                  v.size < 100000000 ||
                  'Trailer size should be less than 100 MB!',
              ]"
              @change="onChangeTrailer"
            ></v-file-input>

            <!-- Trailer Preview -->
            <!-- Trailer is not selected (null) -->
            <video
              v-if="trailerPreviewPath == null"
              class="mb-2"
              width="100%"
              :src="localDomain + toUpdateGame.trailerPath"
              controls
            ></video>
            <!-- Trailer is selected (not null) -->
            <video
              v-if="trailerPreviewPath != null"
              class="mb-2"
              width="100%"
              :src="trailerPreviewPath"
              controls
            ></video>

            <!-- Update Btn -->
            <v-btn
              :disabled="!gameForm"
              color="success"
              class="mr-4"
              @click="updateGame"
            >
              <span v-if="!loading">Update</span>
              <v-progress-circular
                v-else
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-btn>

            <!-- Error Alert -->
            <v-alert class="mt-3" v-show="errorAlert" dense type="error">
              Update Game Failed!
            </v-alert>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import utils from "../utils/utils";
import sidebar_admin from "../components/sidebar_admin.vue";


export default {
  name: "admin",

  components: { sidebar_admin },

  data() {
    return {
      localDomain: utils.constant.localDomain,

      headers: [
        { text: "ID", value: "id", sortable: true },
        { text: "Poster", value: "posterPath", sortable: false },
        { text: "Title", value: "title", sortable: true },
        { text: "Budget", value: "budget", sortable: true },
        { text: "Overview", value: "overview", width: 200, sortable: false },
        { text: "Category", value: "category.name", sortable: true },
        { text: "Platform", value: "platform.name", sortable: true },
        { text: "Out of Stock", value: "out_of_stock" },
        { text: "CreatedAt", value: "createdAt", sortable: true },
        { text: "UpdatedAt", value: "updatedAt", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      gameList: [],

      deleteDialog: false,
      toDeleteGame: {},

      updateDialog: false,
      gameForm: false,
      toUpdateGame: {
        title: "",
        overview: "",
        budget: 0,
        category: 1,
        platform: 1,
        out_of_stock: false,
        posterPath: "",
        poster: null,
        trailerPath: "",
        trailer: null,
      },
      posterPreviewPath: null,
      trailerPreviewPath: null,

      errorAlert: false,
      loading: false,

      gameCategoryList: [],
      gamePlatformList: [],
    };
  },

  async created() {
    await this.fetchGameCategories();
    await this.fetchGamePlatforms();
    await this.fetchGames();
  },

  methods: {
    async fetchGames() {
      const resp = await utils.http.get("/game");
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.gameList = data;
        }
      }
    },

    async fetchGameCategories() {
      const resp = await utils.http.get("/admin/category");
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.gameCategoryList = data;
        }
      }
    },
    async fetchGamePlatforms() {
      const resp = await utils.http.get("/admin/platform");
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.gamePlatformList = data;
        }
      }
    },

    async deleteGame() {
      const resp = await utils.http.del(
        "/admin/game/delete/" + this.toDeleteGame.id
      );
      if (resp && resp.status === 200) {
        this.deleteDialog = false;
        // Refresh Games
        await this.fetchGames();
      } else {
        this.errorAlert = true;
      }
    },

    onClickUpdateGame(item) {
      this.updateDialog = true;
      // Copy Object
      this.toUpdateGame = Object.assign({}, item);
      this.toUpdateGame.poster = null;
      this.toUpdateGame.trailer = null;
      this.posterPreviewPath = null;
      this.trailerPreviewPath = null;
    },

    async updateGame() {
      // Form Validation
      if (this.$refs.gameForm.validate()) {
        this.errorAlert = false;

        this.loading = true;

        let posterPath = this.toUpdateGame.posterPath;
        let trailerPath = this.toUpdateGame.trailerPath;

        // Step 1 -> Update Poster

        // Null -> Poster is not selected
        if (this.toUpdateGame.poster != null) {
          // Update Poster API
          const respPoster = await utils.http.putMedia(
            "/admin/file/update",
            this.toUpdateGame.poster,
            this.toUpdateGame.poster.type,
            this.toUpdateGame.posterPath
          );
          if (respPoster && respPoster.status === 200) {
            posterPath = await respPoster.text();
          } else {
            console.debug("Poster Update Failed");
          }
        }

        // Step 2 -> Update Trailer

        if (this.toUpdateGame.trailer != null) {
          const respTrailer = await utils.http.putMedia(
            "/admin/file/update",
            this.toUpdateGame.trailer,
            this.toUpdateGame.trailer.type,
            this.toUpdateGame.trailerPath
          );
          if (respTrailer && respTrailer.status === 200) {
            trailerPath = await respTrailer.text();
          } else {
            console.debug("Trailer Update Failed");
          }
        }

        // Step 3 -> Update Game

        const respGame = await utils.http.put(
          "/admin/game/update/" + this.toUpdateGame.id,
          {
            title: this.toUpdateGame.title,
            overview: this.toUpdateGame.overview,
            budget: this.toUpdateGame.budget,
            category: {
              id: this.toUpdateGame.category,
            },
            platform: {
              id: this.toUpdateGame.platform,
            },
            out_of_stock: this.toUpdateGame.out_of_stock,
            posterPath: posterPath,
            trailerPath: trailerPath,
          }
        );
        if (respGame && respGame.status === 200) {
          this.toUpdateGame.poster = null;
          this.toUpdateGame.trailer = null;
          this.updateDialog = false;
          // Refresh Games
          await this.fetchGames();
        } else {
          this.errorAlert = true;
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
