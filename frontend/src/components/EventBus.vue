<script>
  import Vue from 'vue'
  const EventBus = new Vue()
  export default EventBus
</script>
<!--
  usato così che l'emit component possa emettere un metodo

  così profile e gli altri component possono ricevere qualsiasi dato
  con il particolare nome per l'emit method
-->