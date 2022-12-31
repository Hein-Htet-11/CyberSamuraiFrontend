<template>
  <div>
    <v-row justify="center" class="space px-16 pb-5">
            <v-col justify="center" class="space px-1 pb-5">
              <v-navigation-drawer
        absolute
        bottom
        permanent
        color="#232323"
      >
        <v-list
          nav
          dense
        >
      <v-expansion-panels
    class="mx-auto"
    dark
    hover
    popout
    >
      
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

      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-list-item link>
          <v-list-item-icon>
                <v-icon
      color="grey darken-2"
    >
      mdi-controller
    </v-icon>
         </v-list-item-icon>
</v-list-item>
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
    </v-list>
      </v-navigation-drawer>
      </v-col>

      <!-- Game List -->
        
          <v-col align-self="start" class="space px-1 pb-5" cols="12" xl="3" sm="8" md="3" offset-md="1" lg="3" offset-lg="1"  v-for="(game, index) in gameList" :key="index">
            <v-hover
        v-slot="{ hover }"
        close-delay="200"
      >  
            <v-card class="mx-auto rounded-xl" 
            :elevation="hover ? 16 : 2"
          :class="{ 'on-hover': hover }"
            max-width="300" dark flat outlined @click="goToGameDetails(game)" height="500">
              
              <v-card-text>
                
                <div align="center" justify="center">
                  
                <v-img
                  :src="localDomain + game.posterPath"
                  max-height="270"
                  max-width="270"
                  contain
                  cover
                >
                <v-card-title v-show="game.out_of_stock">
                <v-alert dense outlined shaped type="error">Out of Stock</v-alert>
              </v-card-title>
              </v-img>
                </div>
                <v-card-title class="yellow--text">{{ game.title }}</v-card-title>
                <v-card-title class="grey--text text-grey-darken-1 caption mt-n4">{{ game.category.name}}</v-card-title>
                <v-card-title class="yellow--text mt-n4">{{ game.budget }} Kyat</v-card-title>
                <v-card-title class="grey--text text-grey-darken-1 caption mt-n4">{{ game.platform.name}}</v-card-title>
                
                <v-card-actions class="mx-2 mt-n4">
          <v-spacer></v-spacer>
          <v-btn class="mx-2 mt-n3"  fab dark small color="green">
            <v-icon dark> mdi-cart </v-icon>
          </v-btn>
          <v-btn class="mx-2 mt-n3"  fab dark small color="red">
            <v-icon dark> mdi-heart </v-icon>
          </v-btn>
          
        </v-card-actions>
              </v-card-text>
            </v-card>
            </v-hover>
          </v-col>
          
        
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
<style lang="sass" scoped>
.v-card.on-hover.theme--dark
  background-color: rgba(#000, 0.8)
  >.v-card__text
    color: #000
</style>