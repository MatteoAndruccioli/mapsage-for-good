<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mt-5 mx-auto">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="customer-tab" data-toggle="tab" href="#customer" role="tab" aria-controls="customer" aria-selected="true">Customer</a>
          </li>
          <li class="nav-item">
            <a v-on:click="refreshMap" class="nav-link" id="masseur-tab" data-toggle="tab" href="#masseur" role="tab" aria-controls="masseur" aria-selected="false">Masseur</a>
          </li>
        </ul>

        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="customer" role="tabpanel" aria-labelledby="customer-tab">
            <CustomerRegisterPanel/>
          </div>
          <div class="tab-pane fade" id="masseur" role="tabpanel" aria-labelledby="masseur-tab">
            <MasseurRegisterPanel/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerRegisterPanel  from "./CustomerRegisterPanel"
import MasseurRegisterPanel  from "./MasseurRegisterPanel"

import Vue from 'vue'
export const eventBus = new Vue()

export default {
  components: {
    CustomerRegisterPanel,
    MasseurRegisterPanel
  },
  methods: {
    refreshMap() {
      eventBus.$emit('refreshMap')
    }
  }
}
</script>

<style scoped>
.my_container {
  display: flex;
  justify-content: center;
}

.my_mt-10 {
  margin-top: 10rem;
}

.my_bg-white{
  background: #fff;
}

.my_card {
  height: 10rem;
  width: 20rem;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

</style>
