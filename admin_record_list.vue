<template>
  <div>
    <v-row>
      <!-- Sidebar -->
      <v-col cols="2">
        <sidebar_admin></sidebar_admin>
      </v-col>

      <!-- Record Table -->
      <v-col cols="10">
        <v-data-table
          :headers="headers"
          :items="recordList"
          :items-per-page="5"
          class="elevation-1"
        >
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import utils from "../utils/utils";
import sidebar_admin from "../components/sidebar_admin.vue";

export default {
  name: "admin_record_list",
  components: { sidebar_admin },

  data() {
    return {
      headers: [
        { text: "ID", value: "id", sortable: true },
        { text: "User ID", value: "user.id", sortable: true },
        { text: "User Name", value: "user.name", sortable: true },
        { text: "Game ID", value: "game.id", sortable: true },
        { text: "Game Title", value: "game.title", sortable: true },
      ],
      recordList: [],
    };
  },

  async created() {
    await this.fetchRecords();
  },

  methods: {
    async fetchRecords() {
      const resp = await utils.http.get("/admin/record");
      if (resp && resp.status === 200) {
        const data = await resp.json();
        if (data) {
          this.recordList = data;
        }
      }
    },
  },
};
</script>
