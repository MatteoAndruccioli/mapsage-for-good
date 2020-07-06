<template>
  <div>
    <Navbar/>
    <div class="page-not-found-panel">
      <img src="../assets/images/dog-ate.png" alt="A dog eating a sheet">
      <p class="display-4"> A Dog Ate this Page </p>
      <p class="lead description">Your dog is cute but honestly a menace. Where are my shoes? Where is my graduation certificate? Where is the chocolate cake I baked for my Aunt’s birthday? And why did you take your dog to the vet on that same Thursday?!</p>
      <router-link :to="{ name: 'Home_view'}" class="btn submit-button" type="button"><span>Go to Home</span></router-link>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
  name: 'PageNotFound_view',
  components: {
    Navbar
  }
}
</script>

<style lang="scss" scoped>
  .page-not-found-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      max-width: 30%;
      height: auto;
    }
    .description {
      padding-left: 20%;
      padding-right: 20%;
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
        &:before {
          content: '\00AB';
          position: absolute;
          opacity: 0;
          top: 0;
          left: -20px;
          transition: 0.5s;
        }
      }
      &:hover {
        color: #fff;
        background-color: #138496;
        border-color: #117a8b;
        span {
          padding-left: 15px;
          &:before {
            opacity: 1;
            left: 0;
          }
        }
      }
    }
  }
</style>
