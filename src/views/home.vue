<template>
  <div>
    <v-row>
      <!-- SideBar Menu -->
      <v-col cols="2.5">
        <v-list dense nav>
            <v-row justify="start">
              
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>

          <v-list-item-icon>
                <v-icon
      color="grey darken-2"
    >
      mdi-controller
    </v-icon>
         </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Category</v-list-item-title>
                </v-list-item-content>

  </v-expansion-panel-header>
  
        <v-expansion-panel-content>
          <v-list dense nav>
              <v-list-item
                v-for="(cat, index) in gameCategoryList"
                :key="index"
                link
                @click="onClickCategory(cat)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ cat.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

        </v-expansion-panel-content>
      
      </v-expansion-panel>
    </v-expansion-panels>
 
  </v-row>
        <v-row justify="start">
          
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>

<v-list-item-icon>
      <v-icon
color="grey darken-2"
>
mdi-gamepad
</v-icon>
</v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>Platform</v-list-item-title>
      </v-list-item-content>

</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list dense nav>
              <v-list-item
                v-for="(platform, index) in gamePlatformList"
                :key="index"
                link
                @click="onClickPlatform(platform)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ platform.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-row>
        
      
    </v-list>
      </v-col>

      <!-- Game List -->
      
        <v-row justify="center" class="space px-16 pb-5">

          <v-col cols="12" xs="12" sm="6" md="4" v-for="(game, index) in gameList" :key="index">
            <v-card class="mx-auto rounded-xl" max-width="300" color="" flat outlined @click="goToGameDetails(game)" height="500">
              <v-card-text>
                <div align="center" justify="center">
                <v-img
                  :src="localDomain + game.posterPath"
                  max-height="300"
                  max-width="300"
                  contain
                  cover
                ></v-img>
                </div>
                <v-card-title class="">{{ game.title }}</v-card-title>
                <v-card-title class="grey--text text-grey-darken-1 caption mt-n4">{{ game.category.name}}</v-card-title>
                <v-card-title class="mt-n4">{{ game.budget }} Kyat</v-card-title>
                <v-card-title class="grey--text text-grey-darken-1 caption mt-n4">{{ game.platform.name}}</v-card-title>
                <!-- <v-card-title class="grey--text text-grey-darken-1 caption mt-n4" v-show="game.out_of_stock">Out of Stock</v-card-title> -->
                <v-card-actions class="mx-2 mt-n4">
          <v-btn outlined class="mt-n2 add">
            <v-icon color="green" @click="decrement"> mdi-minus </v-icon>
          </v-btn>

          <strong class="mx-2" v-text="bpm"></strong>
          <v-btn outlined class="mt-n2 add">
            <v-icon color="green" @click="increment"> mdi-plus </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn class="mx-2 mt-n3" fab dark small color="red">
            <v-icon dark> mdi-heart </v-icon>
          </v-btn>
        </v-card-actions>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      
    </v-row>
  </div>
</template>

<script>
import utils from "../utils/utils";

export default {
  name: "home",

  components: {},

  data() {
    
    
    return {
      localDomain: utils.constant.localDomain,

      catList: [],
      platformList: [],
      gameList: [],

      gameCategoryList: [],
      gamePlatformList: [],
      bpm:1,
    };
    
  },

  async created() {
    await this.fetchGameCategories();
    await this.fetchGamePlatforms();
    await this.fetchGames();
  },

  methods: {
    decrement () {
        this.bpm--;
      },
      increment () {
       this.bpm++;
      },

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
        // data is not undefined, not null
        if (data) {
          this.gameCategoryList = data;
        }
      }

      
    },

    async fetchGamePlatforms() {
      const resp = await utils.http.get("/admin/platform");
      if (resp && resp.status === 200) {
        const data = await resp.json();
        // data is not undefined, not null
        if (data) {
          this.gamePlatformList = data;
        }
      }

      
    },

    goToGameDetails(game) {
      this.$router.push({
        path: "/game_details/" + game.id,
      });
    },

    async onClickCategory(cat) {
      const resp = await utils.http.get("/game/category/" + cat.id);
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.gameList = data;
        }
      }
    },

    async onClickPlatform(platform) {
      const resp = await utils.http.get("/game/platform/" + platform.id);
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.gameList = data;
        }
      }
    },

  },
};
</script>