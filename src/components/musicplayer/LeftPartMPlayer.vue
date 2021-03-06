<template>
  <div>
    <div>
      <v-card
        class="mx-1 justify-space-between "
        max-width="350"
        id="info-card"
        elevation="0"
      >
        <v-layout justify-start align-center class="mx-0">
          <v-flex
            align-self-center
            shrink
            class="mx-1"
            v-if="!$store.state.MusicPlayer.navBarImage"
          >
            <router-link
              :to="albumid"
              tag="button"
              :disabled="isLinkDisabled"
              id="image-album"
            >
              <v-img
                max-height="60"
                max-width="60"
                :src="imgsrc"
                contain
                @mouseenter="imageButton = true"
                @mouseleave="imageButton = false"
                id = "inner-image-album"
              >
                <v-icon
                  color="grey"
                  v-show="imageButton"
                  @click="
                    ($store.state.MusicPlayer.navBarImage = true),
                      (isLinkDisabled = false)
                  "
                  @mouseenter="isLinkDisabled = true"
                  @mouseleave="isLinkDisabled = false"
                  >mdi-chevron-up-circle</v-icon
                ></v-img
              >
            </router-link>
          </v-flex>

          <v-flex align-self-center shrink class="mx-2">
            <v-layout justify-center align-center column>
              <router-link
                :to="albumid"
                id="song-name"
              >
                {{ $store.state.MusicPlayer.currentSong.track.name }}
              </router-link>

              <router-link
                :to="artistid"
                id="artist-name"
              >
                {{ artistname }}
              </router-link>
            </v-layout>
          </v-flex>
          <v-flex align-self-center shrink class="mx-1 ml-5">
            <v-icon
              v-if="!heartcolor"
              color="grey"
              @click="changeHeart"
              class="mx-2 info-buttons"
              dense
              medium
              id="heart-outline"
            >
              mdi-heart-outline
            </v-icon>
            <v-icon
              v-else
              color="green"
              @click="changeHeart"
              class="mx-2 info-buttons"
              dense
              medium
              id="heart"
            >
              mdi-heart
            </v-icon>
            <v-snackbar
              v-model="snackbar"
              :timeout="timeout"
              color="#1DB954"
              id="snack-bar"
            >
              <h3 class="white--text title font-weight-light mx-auto">
                {{ text }}
              </h3>
            </v-snackbar>
            <!-- Removed in new update
            <v-icon color="grey" class="mx-2 info-buttons" dense medium>
              mdi-alpha-x-circle-outline
            </v-icon>
-->
            <v-icon
              :color="hoverPic ? 'green' : 'grey'"
              @click="changeHoverPic"
              class="mx-2 info-buttons"
              dense
              medium
              id="pipButton"
            >
              mdi-picture-in-picture-bottom-right
            </v-icon>
          </v-flex>
        </v-layout>
      </v-card>
    </div>

    <div></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import PlayerRequests from '../../store/modules/MusicPlayer/Requests';
import notePic from '../../assets/imgs/MusicNote.png';
/* eslint-disable no-underscore-dangle */
/**
 * @vue-data {Booelan} heartcolor - Flag for the Heart Color
 * @vue-data {Booelan} hoverPic - Flag for the Picture in Picture
 * @vue-data {Booelan} imageButton - Flag for the Button on the image to show
 * @vue-data {Booelan} isLinkDisabled - Flag to disable the Image Link when Hovered
 * @vue-data {Booelan} snackbar - Flag for the Snack Bar
 * @vue-data {String} text - The text that is written in the Snack Bar
 * @vue-data {Number} timeout - The time the Snack Bar remains Visible
 * @vue-data {HTMLCanvasElement} canvas - The canvas That is Captured by the Video
 * @vue-data {HTMLVideoElement} video - the Video that is Viewed in the Pip
 * @vue-computed {String} albumid
 * @vue-computed {String} artistid
 * @vue-computed {String} imgsrc
 * @vue-computed {String} artistname
 */
export default {
  data: () => ({
    heartcolor: false,
    hoverPic: false,
    imageButton: false,
    isLinkDisabled: false,
    snackbar: false,
    text: '',
    timeout: 2000,
    canvas: document.createElement('CANVAS'),
    video: document.createElement('video'),
  }),
  methods: {
    /**
     *Changes the Like State of the Song In the Player and sends the request to the server
     */
    ...mapActions(['togglePlayact']),
    async changeHeart() {
      let R;
      if (this.heartcolor) {
        R = await PlayerRequests.deleteTrack(
          this.$store.state.MusicPlayer.currentSong.track.id
          // eslint-disable-next-line no-underscore-dangle
          || this.$store.state.MusicPlayer.currentSong.track._id,
        );
      } else {
        R = await PlayerRequests.saveTrack(
          this.$store.state.MusicPlayer.currentSong.track.id
          // eslint-disable-next-line no-underscore-dangle
          || this.$store.state.MusicPlayer.currentSong.track._id,
        );
      }
      if (R) {
        this.heartcolor = !this.heartcolor;
        this.snackbar = true;
        if (this.heartcolor) this.text = 'Added to your Liked Songs';
        else this.text = 'Removed from your Liked Songs';
      }
    },
    /**
     *Changes Whether the pip shows or dissapears
     */
    async changeHoverPic() {
      if (!this.hoverPic) {
        await this.changePnp();
        navigator.mediaSession.setActionHandler('play', () => { this.togglePlayact(); this.video.play(); });
        navigator.mediaSession.setActionHandler('pause', () => { this.togglePlayact(); this.video.pause(); });
        if (!this.playstate) this.video.pause();
        this.hoverPic = true;
      } else {
        document.exitPictureInPicture().catch();
        this.hoverPic = false;
      }
    },
    /**
     * Changes the Picture in Picture Current Song
     */
    async changePnp() {
      const img = new Image();
      img.crossOrigin = true;
      img.src = this.imgsrc;
      await img.decode().catch(async () => {
        img.src = notePic; await img.decode();
      });
      const scale = Math.min(this.canvas.width / img.width, this.canvas.height / img.height);
      // get the top left position of the image
      const x = (this.canvas.width / 2) - (img.width / 2) * scale;
      const y = (this.canvas.height / 2) - (img.height / 2) * scale;
      this.canvas.getContext('2d').drawImage(img, x, y, img.width * scale, img.height * scale);
      await this.video.play();
      await this.video.requestPictureInPicture().catch();
    },
  },
  computed: {
    albumid() {
      if (this.$store.state.MusicPlayer.currentSong.track.album._id !== undefined) {
        return `/album/${this.$store.state.MusicPlayer.currentSong.track.album._id}`;
      }
      return `/album/${this.$store.state.MusicPlayer.currentSong.track.album.id}`;
    },
    artistid() {
      if (this.$store.state.MusicPlayer.currentSong.track.artists[0].userInfo !== undefined) {
        return `/home/artist/${this.$store.state.MusicPlayer.currentSong.track.artists[0].userInfo._id}`;
      }
      return `/home/artist/${this.$store.state.MusicPlayer.currentSong.track.artists.id}`;
    },
    artistname() {
      if (this.$store.state.MusicPlayer.currentSong.track.artists[0].userInfo !== undefined) {
        return this.$store.state.MusicPlayer.currentSong.track.artists[0].userInfo.name;
      }
      return '';
    },
    imgsrc() {
      if (this.$store.state.MusicPlayer.currentSong.track.album.images !== undefined
      && this.$store.state.MusicPlayer.currentSong.track.album.images[0] !== undefined) {
        return this.$store.state.MusicPlayer.currentSong.track.album.images[0].url;
      }
      return notePic;
    },
    playstate() {
      return this.$store.state.MusicPlayer.isPlaying;
    },
  },
  watch: {
  /* istanbul ignore next */
    async imgsrc() {
      if (this.hoverPic) {
        await this.changePnp();
      }
    },
    /* istanbul ignore next */
    async playstate() {
      if (this.playstate) this.video.play().catch(() => 0);
      else this.video.pause();
    },
  },
  async updated() {
    this.heartcolor = await PlayerRequests
      .checkLiked(
        this.$store.state.MusicPlayer.currentSong.track.id
        // eslint-disable-next-line no-underscore-dangle
        || this.$store.state.MusicPlayer.currentSong.track._id,
      );
  },
  async created() {
    this.heartcolor = await PlayerRequests
      .checkLiked(
        this.$store.state.MusicPlayer.currentSong.track.id
        // eslint-disable-next-line no-underscore-dangle
        || this.$store.state.MusicPlayer.currentSong.track._id,
      );
    this.video.addEventListener('enterpictureinpicture', () => {
    // Video element entered Picture-In-Picture mode.
      this.hoverPic = true;
    });

    this.video.addEventListener('leavepictureinpicture', () => {
    // Video element left Picture-In-Picture mode.
      this.hoverPic = false;
    });
    this.canvas.height = 1000;
    this.canvas.width = 1000;
    this.video.muted = true;
    this.video.srcObject = this.canvas.captureStream(30);
  },
};
</script>

<style scoped>
#song-name {
  font-size: 13px;
  color: white;
  font-family: Helvetica Neue, Helvetica, Arial, Hiragino Kaku Gothic Pro,
    Meiryo, MS Gothic, sans-serif;
  text-decoration: none;
  text-align: left;
}
#song-name:hover {
  text-decoration: underline;
}
#artist-name {
  font-size: 13px;
  color: grey;
  font-family: Helvetica Neue, Helvetica, Arial, Hiragino Kaku Gothic Pro,
    Meiryo, MS Gothic, sans-serif;
  text-decoration: none;
  text-align: left;
}
#artist-name:hover {
  color: white;
}
.info-buttons:hover {
  color: white !important;
}
#info-card {
  background-color: transparent;
  border-color: transparent;
}
#snack-bar {
  bottom: 10%;
  left: 38%;
  height: 100px;
  width: 200px;
}
</style>
