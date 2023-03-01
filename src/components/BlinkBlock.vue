<template>
  <span class="loading-text">&ZeroWidthSpace;</span>
</template>

<script>
export default {
  name: "BlinkBlock",
};
</script>

<style>
.loading-text {
  margin: 0;
}
.loading-text::after {
  animation: blink 1s step-end infinite;
  content: "▋";
  margin-left: 0.25rem;
  vertical-align: baseline;
}
@-webkit-keyframes blink {
  67% {
    opacity: 0;
  }
}
@-moz-keyframes blink {
  67% {
    opacity: 0;
  }
}
@-o-keyframes blink {
  67% {
    opacity: 0;
  }
}
@keyframes blink {
  67% {
    opacity: 0;
  }
}
</style>
