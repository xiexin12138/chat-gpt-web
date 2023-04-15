<template>
  <div class="iframe-page-wrap">
    <iframe class="iframe-page" :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: "IframePage",
  props: {
    url: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.iframe-page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}
.iframe-page-wrap {
  padding-top: 46px;
  width: 100vw;
  height: 100vh;
  margin: 0;
}
</style>
