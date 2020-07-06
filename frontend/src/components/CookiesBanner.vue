<template>
  <div id="banner_cookie" class="container bg-dark fixed-bottom">
    <section>
      <div id="info-panel" class="row">
        <header>
          <h6>Information</h6>
        </header>
        <p>
          This site or third-party tools integrated in it make use of cookies that are necessary for the operation
          and the achievement of purposes described in the cookie policy. <br/>
          You declare to accept the use of cookies by closing or hiding this banner, continuing browsing
          on this page, by clicking a link or button or continuing to browse in another way.
        </p>
      </div>
    </section>
    <div id="buttons-panel" class="row">
      <a id="btn-more" class="mr-auto btn btn-secondary" href="http://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/3585077">More info</a>
      <a v-on:click="acceptCookiePolicy" id="btn-accept" class="btn submit-button">Accept</a>
      <a v-on:click="hideBanner" id="btn-reject" class="btn submit-button">Reject</a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    acceptCookiePolicy: function() {
      this.$cookies.set("cookiePolicy", true, Infinity);
      this.hideBanner();
    },
    hideBanner: function() {
      this.$emit('hideMe');
    }
  }
}
</script>

<style lang="scss" scoped>
  #banner_cookie {
    border-radius: 10px;
    section {
      color: #C0C0C0;
      p {
        font-size: 0.875em;
      }
    }
    #info-panel {
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 20px;
    }
    #buttons-panel {
      padding-left: 20px;
      padding-right: 20px;
      padding-bottom: 20px;
    }
    #btn-accept {
      margin-right: 20px;
    }
    #btn-reject {
      margin-right: 10px;
    }

    .submit-button {
      padding: .5rem 1rem;
      line-height: 1.5;
      border-radius: .3rem;
      color: #fff;
      background-color: #17a2b8;
      transition: all 0.5s;
      span {
        cursor: pointer;
        display: inline-block;
        position: relative;
        transition: 0.5s;
        &:after {
          content: '\00bb';
          position: absolute;
          opacity: 0;
          top: 0;
          right: -20px;
          transition: 0.5s;
        }
      }
      &:hover {
        color: #fff;
        background-color: #138496;
        border-color: #117a8b;
        span {
          padding-right: 15px;
          &:after {
            opacity: 1;
            right: 0;
          }
        }
      }
    }
  }
</style>
