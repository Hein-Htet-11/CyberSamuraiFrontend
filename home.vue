<template>
  <v-app class="cover">
    <div>                    
      <v-img class="image" src="https://images5.alphacoders.com/105/thumb-1920-1056682.png" max-height="100%" max-width="100%">
      </v-img>
    </div>
    <div style="height:50px"></div>
    <div class="container">      
        <h1>Platform</h1>      
    </div>
    <div class="platform">    
      <v-row dense>
        <v-col class="game"
          v-for="card in cards"
          :key="card.title"
          :cols="card.flex"
        >
          <v-card>
            <router-link class="mx-2 navlink" to="/game_list" color="white">
            <v-img
              :src="card.src"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              height="200px"
            >
              <v-card-title v-text="card.title"></v-card-title>
            </v-img>
            </router-link>
          </v-card>
        </v-col> 
      </v-row> 
     </div>
     <div style="height:70px"></div>
     <div>
      <span class="seller">Top Seller</span>     
     </div>
     <div style="height:70px"></div>
  </v-app> 
</template>

<script>

  export default {
    name: 'home',

    data: () => ({
      cards: [
        { title: 'PS5', src: 'ps5.png', flex: 3 },
        { title: 'PS4', src: 'ps4.jpg', flex: 3 },
        { title: 'XBOX', src: 'xbox.jpg', flex: 3 },
        { title: 'NS', src: 'NS Oled.jpg', flex: 3 },
      ],
    }),
  };
</script>

<style>
    .image {             
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: cover; 
        margin:auto;                   
    } 
    .cover{
      margin-top: 0px;
    }
    .container{           
      max-width:500px;
      margin:auto;
      display:flex;
      justify-content:center;
    }    
    .platform{
      padding:10px;
      margin:auto;
      margin-left:10px;
      margin-right:10px;      
    } 
    .seller{
      max-width:500px;
      margin:auto;
      display:flex;
      color:red;
      font-size:30px;
      justify-content:center;
    } 
    .navlink{
      text-decoration:none;
    }     
</style>