<template>
  <v-footer dark padless>
    <v-card flat tile class="black white--text py-2 px-1" width="100%">
      <v-row>
        <v-col cols="12" xs="12" sm="6" md="4" class="pa-16">
          <v-toolbar color="transparent" flat>
            <v-badge color="#ffffff" dot>
              <v-img src="" contain width="30"></v-img>
            </v-badge>

            <v-toolbar-title class="ml-4">
              <span class="yellow--text">Cyber</span><strong>Samurai</strong>
            </v-toolbar-title>
          </v-toolbar>
          
          <v-card-text class="pt-0">
            <v-btn
              v-for="icon in icons"
              :key="icon"
              class="mx-1 white--text"
              icon
              fab
              outlined
              small
            >
              <v-icon size="20px">
                {{ icon }}
              </v-icon>
            </v-btn>
          </v-card-text>
          
        </v-col>
        <v-footer color="transparent" padless>
    <v-col class="text-center text-white" cols="12">
      <strong>CopyRights @ 2022 Cyber Security Game Store</strong>
    </v-col>
  </v-footer>

      </v-row>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: "footing",
  data: () => ({
    icons: [
      "mdi-phone",
      "mdi-google",
      "mdi-instagram",
      "mdi-facebook",
    ],
  }),
};
</script>

<style scoped>
.text-white {
  color: white !important;
}
</style>