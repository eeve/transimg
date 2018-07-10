<template>
  <div class='settings'>
    <div class='form-group'>
      <label class='label' for='hosting'>图床</label>
      <select name='hosting' id='hosting'>
        <option value='sm.ms'>sm.ms</option>
      </select>
    </div>
    <div class='form-group'>
      <label class='label'>复制成功时</label>
      <label><input type="radio" name='poptip' value='silent'>静默模式</label>
      <label><input type="radio" name='poptip' value='poptip'>弹出提示</label>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang='less' scoped>
.settings {
  padding: 20px;
  font-size: 14px;
}
.form-group {
  margin-bottom: 25px;
  .label {
    display: block;
    font-weight: 700;
    margin-bottom: 10px;
  }
}
</style>
