<template>
    <div>
        <v-card class="mx-auto">
    <v-navigation-drawer permanent>
      <v-list dense nav>
        <v-list-item
          v-for="item in menuItemList"
          :key="item.title"
          link
          @click="goToRoute(item.path)"
        >
          <!-- Icon -->
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <!-- Title -->
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-card class="mx-auto">
          <!--<v-navigation-drawer permanent>-->
            <v-row justify="center">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Category</v-expansion-panel-header>
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


        <v-row justify="center">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>Platform</v-expansion-panel-header>
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
          <!-- </v-navigation-drawer> -->
        </v-card>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
    </div>
  </template>
  
  <script>
  import utils from "../utils/utils";
  
  export default {
    name: "gameList",
  
    components: {},
  
    data: () => ({
    menuItemList: [
      {
        title: "Category",
        icon: "mdi-table",
        path: "/admin/category",
      },
      {
        title: "Platform",
        icon: "mdi-controller",
        path: "/admin/platform",
      },
    ],
  }),
  
    async created() {
      await this.fetchGameCategories();
      await this.fetchGamePlatforms();
      await this.fetchGames();
    },
  
    methods: {
        goToRoute(path) {
      // If Current Path is same with Clicked Path, No Go to Route
      if (this.$route.path != path) {
        this.$router.push({ path: path });
      }
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
  