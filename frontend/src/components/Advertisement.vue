<template>
  <li class="list-group-item">
    <div class="card bg-light mb-3 ">
      <div class="card-header">{{title}}</div>
      <div class="card-body">
        <p class="card-text">{{body}}</p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: [
    'title', 
    'body'
  ],
}
</script>