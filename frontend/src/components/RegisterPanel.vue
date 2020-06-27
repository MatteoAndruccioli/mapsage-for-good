<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 outer-container">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a @click="profile_type='Customer'" class="nav-link active" id="customer-tab" data-toggle="tab" href="#customer" role="tab" aria-controls="customer" aria-selected="true">Customer</a>
          </li>
          <li class="nav-item">
            <a @click="profile_type='Masseur'" class="nav-link" id="masseur-tab" data-toggle="tab" href="#masseur" role="tab" aria-controls="masseur" aria-selected="false">Masseur</a>
          </li>
        </ul>

        <main class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="customer" role="tabpanel" aria-labelledby="customer-tab">
            <CustomerRegisterPanel v-if="profile_type=='Customer'"/>
          </div>
          <div class="tab-pane fade" id="masseur" role="tabpanel" aria-labelledby="masseur-tab">
            <MasseurRegisterPanel v-if="profile_type=='Masseur'"/>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import CustomerRegisterPanel  from "./CustomerRegisterPanel"
import MasseurRegisterPanel  from "./MasseurRegisterPanel"

export default {
  components: {
    CustomerRegisterPanel,
    MasseurRegisterPanel
  },
  data() {
    return {
      // Required for map refreshing
      profile_type: 'Customer'
    }
  }
}
</script>

<style scoped>
  .outer-container{
    margin-top: 3rem;
    margin-left: auto;
    margin-right: auto;
  }

  .nav-item a{
    color: #17a2b8;
    font-weight: 480;
  }
</style>
